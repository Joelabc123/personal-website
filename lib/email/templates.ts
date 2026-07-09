import Handlebars from "handlebars";
import { siteConfig } from "@/lib/siteConfig";
import { layoutTemplate } from "@/lib/email/layout";

export type ContactEmailData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
};

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

const adminContentTemplate = Handlebars.compile(`
<h1 style="margin:0 0 16px; font-size:20px; font-weight:bold; color:#000000;">Neue Nachricht über das Kontaktformular</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
  <tr>
    <td style="padding:6px 0; font-weight:bold; width:110px; vertical-align:top; color:#000000;">Name</td>
    <td style="padding:6px 0; color:#333333;">{{name}}</td>
  </tr>
  <tr>
    <td style="padding:6px 0; font-weight:bold; vertical-align:top; color:#000000;">E-Mail</td>
    <td style="padding:6px 0;"><a href="mailto:{{email}}" style="color:#000000; text-decoration:underline;">{{email}}</a></td>
  </tr>
  <tr>
    <td style="padding:6px 0; font-weight:bold; vertical-align:top; color:#000000;">Betreff</td>
    <td style="padding:6px 0; color:#333333;">{{subject}}</td>
  </tr>
</table>
<div style="padding:16px; background-color:#f4f4f5; border-radius:8px; color:#111111; font-size:14px; line-height:1.6;">
  {{nl2br message}}
</div>
<p style="margin:24px 0 0; font-size:12px; color:#71717a;">Eingegangen am {{submittedAt}} &middot; Antworten gehen per Reply-To direkt an {{email}}.</p>
`);

export function renderAdminNotificationEmail(data: ContactEmailData): EmailContent {
  const content = adminContentTemplate(data);
  const html = layoutTemplate({
    lang: "de",
    title: "Neue Kontaktanfrage",
    previewText: `Neue Nachricht von ${data.name}: ${data.subject}`,
    siteName: siteConfig.name,
    footerText: `Automatisch gesendet vom Kontaktformular auf ${siteConfig.domain}.`,
    content,
  });
  const text = [
    "Neue Nachricht über das Kontaktformular",
    "",
    `Name: ${data.name}`,
    `E-Mail: ${data.email}`,
    `Betreff: ${data.subject}`,
    "",
    data.message,
    "",
    `Eingegangen am ${data.submittedAt}`,
  ].join("\n");

  return { subject: `Neue Kontaktanfrage: ${data.subject}`, html, text };
}

type ConfirmationLocale = "de" | "en";

const CONFIRMATION_COPY: Record<
  ConfirmationLocale,
  {
    subject: (name: string) => string;
    heading: string;
    greeting: (name: string) => string;
    bodyText: string;
    subjectLabel: string;
    footerText: string;
    previewText: string;
  }
> = {
  de: {
    subject: (name) => `Danke für deine Nachricht, ${name}!`,
    heading: "Danke für deine Nachricht!",
    greeting: (name) => `Hallo ${name},`,
    bodyText:
      "vielen Dank für deine Nachricht über das Kontaktformular auf joelbakirel.de. Ich melde mich so schnell wie möglich bei dir zurück. Zu deiner Referenz findest du unten eine Kopie deiner Nachricht.",
    subjectLabel: "Betreff",
    footerText: "Diese E-Mail wurde automatisch generiert, bitte nicht direkt darauf antworten.",
    previewText: "Deine Nachricht ist bei mir angekommen.",
  },
  en: {
    subject: (name) => `Thanks for your message, ${name}!`,
    heading: "Thanks for your message!",
    greeting: (name) => `Hi ${name},`,
    bodyText:
      "thank you for reaching out through the contact form on joelbakirel.de. I'll get back to you as soon as possible. For your records, here's a copy of your message below.",
    subjectLabel: "Subject",
    footerText: "This email was generated automatically, please don't reply to it directly.",
    previewText: "Your message has reached me.",
  },
};

const confirmationContentTemplate = Handlebars.compile(`
<h1 style="margin:0 0 16px; font-size:20px; font-weight:bold; color:#000000;">{{heading}}</h1>
<p style="margin:0 0 12px;">{{greeting}}</p>
<p style="margin:0 0 24px;">{{bodyText}}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
  <tr>
    <td style="padding:6px 0; font-weight:bold; width:110px; vertical-align:top; color:#000000;">{{subjectLabel}}</td>
    <td style="padding:6px 0; color:#333333;">{{subject}}</td>
  </tr>
</table>
<div style="padding:16px; background-color:#f4f4f5; border-radius:8px; color:#111111; font-size:14px; line-height:1.6;">
  {{nl2br message}}
</div>
<p style="margin:24px 0 0;"><a href="{{siteUrl}}" style="color:#000000; text-decoration:underline;">{{siteUrl}}</a></p>
`);

export function renderVisitorConfirmationEmail(data: {
  name: string;
  subject: string;
  message: string;
  locale: ConfirmationLocale;
}): EmailContent {
  const copy = CONFIRMATION_COPY[data.locale] ?? CONFIRMATION_COPY.de;
  const content = confirmationContentTemplate({
    heading: copy.heading,
    greeting: copy.greeting(data.name),
    bodyText: copy.bodyText,
    subjectLabel: copy.subjectLabel,
    subject: data.subject,
    message: data.message,
    siteUrl: siteConfig.url,
  });
  const html = layoutTemplate({
    lang: data.locale,
    title: copy.heading,
    previewText: copy.previewText,
    siteName: siteConfig.name,
    footerText: copy.footerText,
    content,
  });
  const text = [
    copy.greeting(data.name),
    "",
    copy.bodyText,
    "",
    `${copy.subjectLabel}: ${data.subject}`,
    "",
    data.message,
    "",
    siteConfig.url,
  ].join("\n");

  return { subject: copy.subject(data.name), html, text };
}
