/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");

const DEBUG_PORT = Number(process.env.LOCALE_CHECK_DEBUG_PORT ?? 9334);
const APP_PORT = Number(process.env.LOCALE_CHECK_APP_PORT ?? 3108);
const APP_ORIGIN = `http://127.0.0.1:${APP_PORT}`;

async function waitForPage() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`).then(
        (response) => response.json(),
      );
      const page = pages.find(
        (entry) =>
          entry.type === "page" &&
          entry.url.startsWith(`${APP_ORIGIN}/de`),
      );
      if (page) return page;
    } catch {}

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error("Chrome page did not become available.");
}

function createCdpClient(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  let nextId = 0;

  const opened = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) return;

    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);

    if (message.error) {
      request.reject(new Error(message.error.message));
    } else {
      request.resolve(message.result);
    }
  });

  return {
    async send(method, params = {}) {
      await opened;
      const id = ++nextId;
      const result = new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
      socket.send(JSON.stringify({ id, method, params }));
      return result;
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }
  return result.result.value;
}

async function captureGlobe(client) {
  const rect = await evaluate(
    client,
    `(() => {
      const rect = document.querySelector("canvas").getBoundingClientRect();
      return {x: rect.x, y: rect.y, width: rect.width, height: rect.height};
    })()`,
  );
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    clip: { ...rect, scale: 1 },
  });
  return Buffer.from(screenshot.data, "base64");
}

async function imageDifference(first, second) {
  const firstRaw = await sharp(first).removeAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const secondRaw = await sharp(second)
    .resize(firstRaw.info.width, firstRaw.info.height)
    .removeAlpha()
    .raw()
    .toBuffer();
  let difference = 0;

  for (let index = 0; index < firstRaw.data.length; index += 1) {
    difference += Math.abs(firstRaw.data[index] - secondRaw[index]);
  }

  return difference / firstRaw.data.length;
}

async function main() {
  const page = await waitForPage();
  const client = createCdpClient(page.webSocketDebuggerUrl);

  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await evaluate(
      client,
      `new Promise((resolve) => {
        const ready = () =>
          document.readyState === "complete" &&
          document.querySelector("[data-phase]") &&
          document.querySelector("canvas");
        if (ready()) return resolve(true);
        const timer = setInterval(() => {
          if (ready()) {
            clearInterval(timer);
            resolve(true);
          }
        }, 50);
      })`,
    );
    await new Promise((resolve) => setTimeout(resolve, 350));
    const initialGlobe = await captureGlobe(client);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    const before = await evaluate(
      client,
      `(() => {
        const loop = document.querySelector("[data-phase]");
        return {
          phase: loop?.dataset.phase ?? null,
          length: document.querySelector("pre code")?.textContent.length ?? 0
        };
      })()`,
    );
    const beforeGlobe = await captureGlobe(client);
    const beforeIdentity = await evaluate(
      client,
      `(() => {
        const cvLink = [...document.querySelectorAll("a")].find(
          (link) => link.pathname === "/de/cv"
        );
        const cvTrack = [...(cvLink?.querySelectorAll("div") ?? [])].find(
          (element) => getComputedStyle(element).willChange.includes("transform")
        );
        const nodes = {
          canvas: document.querySelector("canvas"),
          codeLoop: document.querySelector("[data-phase]"),
          cvTrack,
          main: document.querySelector("main")
        };
        window.__localeAnimationNodes = nodes;
        return {
          cvTransform: cvTrack ? getComputedStyle(cvTrack).transform : null,
          found: Object.fromEntries(
            Object.entries(nodes).map(([key, value]) => [key, Boolean(value)])
          )
        };
      })()`,
    );

    const after = await evaluate(
      client,
      `new Promise((resolve, reject) => {
        document.querySelector(".language-switch")?.closest("button")?.click();
        const timeout = setTimeout(() => reject(new Error("locale timeout")), 7000);
        const timer = setInterval(() => {
          const loop = document.querySelector("[data-phase]");
          if (location.pathname === "/en" && loop) {
            clearInterval(timer);
            clearTimeout(timeout);
            setTimeout(() => resolve({
              path: location.pathname,
              phase: loop.dataset.phase,
              length: document.querySelector("pre code")?.textContent.length ?? 0,
              lang: document.documentElement.lang,
              projectsTitle: [...document.querySelectorAll("h2")]
                .some((heading) => heading.textContent === "Projects")
            }), 350);
          }
        }, 25);
      })`,
    );
    const afterGlobe = await captureGlobe(client);
    const afterIdentity = await evaluate(
      client,
      `(() => {
        const previous = window.__localeAnimationNodes;
        const cvLink = [...document.querySelectorAll("a")].find(
          (link) => link.pathname === "/en/cv"
        );
        const current = {
          canvas: document.querySelector("canvas"),
          codeLoop: document.querySelector("[data-phase]"),
          cvTrack: [...(cvLink?.querySelectorAll("div") ?? [])].find(
            (element) => getComputedStyle(element).willChange.includes("transform")
          ),
          main: document.querySelector("main")
        };
        return {
          same: Object.fromEntries(
            Object.entries(current).map(
              ([key, value]) => [key, value === previous?.[key]]
            )
          ),
          cvTransform: current.cvTrack
            ? getComputedStyle(current.cvTrack).transform
            : null
        };
      })()`,
    );
    const distanceToInitial = await imageDifference(initialGlobe, afterGlobe);
    const distanceToBefore = await imageDifference(beforeGlobe, afterGlobe);

    if (Object.values(beforeIdentity.found).some((found) => !found)) {
      throw new Error(
        `Animation node missing before locale switch: ${JSON.stringify(
          beforeIdentity.found,
        )}`,
      );
    }
    if (Object.values(afterIdentity.same).some((same) => !same)) {
      throw new Error(
        `Homepage node remounted: ${JSON.stringify(afterIdentity.same)}`,
      );
    }
    if (
      !beforeIdentity.cvTransform ||
      beforeIdentity.cvTransform === "none" ||
      beforeIdentity.cvTransform === afterIdentity.cvTransform
    ) {
      throw new Error(
        `CV marquee did not continue (${beforeIdentity.cvTransform} -> ${afterIdentity.cvTransform}).`,
      );
    }
    if (after.lang !== "en" || !after.projectsTitle) {
      throw new Error(
        `Locale copy did not update in place (${JSON.stringify(after)}).`,
      );
    }
    if (distanceToBefore >= distanceToInitial) {
      throw new Error(
        `Globe appears to have reset (${distanceToBefore.toFixed(2)} vs ${distanceToInitial.toFixed(2)}).`,
      );
    }

    const back = await evaluate(
      client,
      `new Promise((resolve, reject) => {
        document.querySelector(".language-switch")?.closest("button")?.click();
        const timeout = setTimeout(() => reject(new Error("reverse locale timeout")), 7000);
        const timer = setInterval(() => {
          if (location.pathname !== "/de") return;

          clearInterval(timer);
          clearTimeout(timeout);
          setTimeout(() => {
            const previous = window.__localeAnimationNodes;
            const cvLink = [...document.querySelectorAll("a")].find(
              (link) => link.pathname === "/de/cv"
            );
            const current = {
              canvas: document.querySelector("canvas"),
              codeLoop: document.querySelector("[data-phase]"),
              cvTrack: [...(cvLink?.querySelectorAll("div") ?? [])].find(
                (element) =>
                  getComputedStyle(element).willChange.includes("transform")
              ),
              main: document.querySelector("main")
            };

            resolve({
              path: location.pathname,
              lang: document.documentElement.lang,
              projectsTitle: [...document.querySelectorAll("h2")]
                .some((heading) => heading.textContent === "Projekte"),
              same: Object.fromEntries(
                Object.entries(current).map(
                  ([key, value]) => [key, value === previous?.[key]]
                )
              ),
              cvTransform: current.cvTrack
                ? getComputedStyle(current.cvTrack).transform
                : null
            });
          }, 350);
        }, 25);
      })`,
    );

    if (Object.values(back.same).some((same) => !same)) {
      throw new Error(
        `Homepage node remounted on reverse switch: ${JSON.stringify(
          back.same,
        )}`,
      );
    }
    if (
      back.lang !== "de" ||
      !back.projectsTitle ||
      back.cvTransform === afterIdentity.cvTransform
    ) {
      throw new Error(
        `Reverse locale switch did not update in place (${JSON.stringify(
          back,
        )}).`,
      );
    }

    console.log(
      JSON.stringify(
        {
          before,
          after,
          back,
          identity: afterIdentity.same,
          cvTransform: {
            before: beforeIdentity.cvTransform,
            after: afterIdentity.cvTransform,
          },
          globeDifference: {
            toBefore: Number(distanceToBefore.toFixed(2)),
            toInitial: Number(distanceToInitial.toFixed(2)),
          },
        },
        null,
        2,
      ),
    );
  } finally {
    client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
