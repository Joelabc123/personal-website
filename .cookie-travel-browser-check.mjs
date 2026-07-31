import { writeFile } from "node:fs/promises";

const cdpBase = "http://127.0.0.1:9224";
const siteBase = "http://127.0.0.1:3114";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function createClient() {
  const targets = await fetch(`${cdpBase}/json`).then((response) => response.json());
  const target = targets.find((candidate) => candidate.type === "page");
  assert(target, "No Chrome page target found.");

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  function call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const response = await call("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.text);
    }
    return response.result.value;
  }

  async function waitFor(expression, message, timeout = 10000) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      if (await evaluate(expression)) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(message);
  }

  async function navigate(path) {
    await call("Page.navigate", { url: `${siteBase}${path}` });
    await waitFor(
      "document.readyState === 'complete'",
      `Page did not load: ${path}`,
    );
  }

  async function screenshot(path) {
    const result = await call("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: false,
    });
    await writeFile(path, Buffer.from(result.data, "base64"));
  }

  await call("Page.enable");
  await call("Runtime.enable");
  return { call, evaluate, navigate, screenshot, waitFor, close: () => socket.close() };
}

const client = await createClient();

try {
  await client.navigate("/de");
  await client.evaluate("localStorage.clear(); location.reload()");
  await client.waitFor(
    "Boolean(document.querySelector('#cookie-consent-title'))",
    "Cookie banner did not appear.",
  );

  const desktopBanner = await client.evaluate(`(() => {
    const element = document.querySelector('#cookie-consent-title').closest('section');
    const rect = element.getBoundingClientRect();
    return {
      right: innerWidth - rect.right,
      bottom: innerHeight - rect.bottom,
      width: rect.width,
      privacyHref: element.querySelector('a')?.getAttribute('href'),
      buttons: [...element.querySelectorAll('button')].map((button) => button.textContent.trim())
    };
  })()`);
  assert(desktopBanner.width <= 441, "Desktop banner is wider than intended.");
  assert(desktopBanner.right > 0 && desktopBanner.bottom > 0, "Desktop banner is not positioned in the lower-right corner.");
  assert(desktopBanner.privacyHref === "/de/datenschutz", "Privacy link is not localized.");
  assert(desktopBanner.buttons.includes("Alle ablehnen"), "Reject-all action is missing.");
  assert(desktopBanner.buttons.includes("Alle annehmen"), "Accept-all action is missing.");

  await client.evaluate(`[...document.querySelectorAll('#cookie-consent-title ~ * button, #cookie-consent-title + * button')];
    [...document.querySelector('#cookie-consent-title').closest('section').querySelectorAll('button')]
      .find((button) => button.textContent.includes('Alle ablehnen')).click()`);
  await client.waitFor(
    "!document.querySelector('#cookie-consent-title')",
    "Reject-all did not close the banner.",
  );
  assert(
    await client.evaluate("localStorage.getItem('joelbakirel-cookie-consent-v1') === 'rejected'"),
    "Reject-all choice was not stored.",
  );

  await client.navigate("/de/contact");
  await client.waitFor("Boolean(document.querySelector('form'))", "Contact form missing.");
  const rejectedContact = await client.evaluate(`({
    hasGoogleScript: Boolean(document.querySelector('script[src*="google.com/recaptcha"]')),
    submitDisabled: document.querySelector('form button[type="submit"]')?.disabled,
    hasReset: [...document.querySelectorAll('footer button')].some((button) => button.textContent.includes('zurücksetzen'))
  })`);
  assert(!rejectedContact.hasGoogleScript, "reCAPTCHA loaded after reject-all.");
  assert(rejectedContact.submitDisabled, "Contact submit should wait for reCAPTCHA consent.");
  assert(rejectedContact.hasReset, "Footer reset action is missing.");

  await client.evaluate(`[
    ...document.querySelectorAll('footer button')
  ].find((button) => button.textContent.includes('zurücksetzen')).click()`);
  await client.waitFor(
    "Boolean(document.querySelector('#cookie-consent-title'))",
    "Footer reset did not reopen the banner.",
  );
  await client.evaluate(`[
    ...document.querySelector('#cookie-consent-title').closest('section').querySelectorAll('button')
  ].find((button) => button.textContent.includes('Alle annehmen')).click()`);
  await client.waitFor(
    "Boolean(document.querySelector('script[src*=" + JSON.stringify("google.com/recaptcha") + "]'))",
    "reCAPTCHA script was not enabled after accept-all.",
  );

  await client.call("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await client.evaluate(`[
    ...document.querySelectorAll('footer button')
  ].find((button) => button.textContent.includes('zurücksetzen')).click()`);
  await client.waitFor(
    "Boolean(document.querySelector('#cookie-consent-title'))",
    "Mobile banner did not appear.",
  );
  await new Promise((resolve) => setTimeout(resolve, 400));
  const mobileBanner = await client.evaluate(`(() => {
    const rect = document.querySelector('#cookie-consent-title').closest('section').getBoundingClientRect();
    return { left: rect.left, right: innerWidth - rect.right, bottom: innerHeight - rect.bottom, width: rect.width };
  })()`);
  assert(
    Math.abs(mobileBanner.left) < 1 && Math.abs(mobileBanner.right) < 1,
    `Mobile banner does not span the full viewport width: ${JSON.stringify(mobileBanner)}`,
  );
  assert(
    Math.abs(mobileBanner.bottom) < 1 && Math.abs(mobileBanner.width - 390) < 1,
    `Mobile banner is not attached to the bottom edge: ${JSON.stringify(mobileBanner)}`,
  );
  await client.screenshot(".cookie-banner-mobile.png");

  await client.evaluate(`[
    ...document.querySelector('#cookie-consent-title').closest('section').querySelectorAll('button')
  ].find((button) => button.textContent.includes('Alle ablehnen')).click()`);
  await client.call("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.navigate("/de/travel/2026/frankreich/trois-vallees-skiurlaub");
  await client.waitFor(
    "document.querySelectorAll('button img').length > 0",
    "Travel gallery images did not render.",
  );
  const openedPortrait = await client.evaluate(`(() => {
    const buttons = [...document.querySelectorAll('button')];
    const portrait = buttons.find((button) => {
      const image = button.querySelector('img');
      return image && Number(image.getAttribute('height')) > Number(image.getAttribute('width'));
    });
    portrait?.click();
    return Boolean(portrait);
  })()`);
  assert(openedPortrait, "No portrait image found for the lightbox check.");
  await client.waitFor(
    "Boolean(document.querySelector('dialog[open] img'))",
    "Lightbox did not open.",
  );
  const lightbox = await client.evaluate(`(() => {
    const dialog = document.querySelector('dialog[open]');
    const image = dialog.querySelector('img');
    const inner = image.parentElement;
    const imageStyle = getComputedStyle(image);
    const imageRect = image.getBoundingClientRect();
    const innerRect = inner.getBoundingClientRect();
    return {
      dialogClientHeight: dialog.clientHeight,
      dialogScrollHeight: dialog.scrollHeight,
      objectFit: imageStyle.objectFit,
      imageWidth: imageRect.width,
      imageHeight: imageRect.height,
      innerWidth: innerRect.width,
      innerHeight: innerRect.height,
      bodyOverflow: getComputedStyle(document.body).overflow,
      rootOverflow: getComputedStyle(document.documentElement).overflow
    };
  })()`);
  assert(lightbox.objectFit === "contain", "Lightbox image does not use contain sizing.");
  assert(lightbox.dialogScrollHeight <= lightbox.dialogClientHeight, "Lightbox is vertically scrollable.");
  assert(lightbox.imageWidth <= lightbox.innerWidth && lightbox.imageHeight <= lightbox.innerHeight, "Lightbox image exceeds its viewport container.");
  assert(lightbox.bodyOverflow === "hidden" && lightbox.rootOverflow === "hidden", "Background scrolling is not locked.");
  await client.screenshot(".travel-lightbox-portrait.png");

  console.log(JSON.stringify({ desktopBanner, mobileBanner, rejectedContact, lightbox }, null, 2));
} finally {
  client.close();
}
