import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/siteConfig";
import { renderAdminNotificationEmail, renderVisitorConfirmationEmail } from "@/lib/email/templates";

export const dynamic = "force-dynamic";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  recaptchaToken: string;
  locale?: string;
};

type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

const RECAPTCHA_SCORE_THRESHOLD = 0.5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 5000;

function isValidPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    ["name", "email", "subject", "message", "recaptchaToken"].every(
      (key) => typeof payload[key] === "string" && (payload[key] as string).trim().length > 0
    ) &&
    ["name", "email", "subject", "message"].every(
      (key) => (payload[key] as string).length <= MAX_FIELD_LENGTH
    )
  );
}

function resolveLocale(locale: unknown): "de" | "en" {
  return locale === "en" ? "en" : "de";
}

// Strips CR/LF so untrusted input can never inject extra email headers.
function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

async function verifyRecaptcha(token: string, remoteIp: string | null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    throw new Error("RECAPTCHA_SECRET_KEY is not configured");
  }

  const params = new URLSearchParams({ secret, response: token });
  if (remoteIp) params.set("remoteip", remoteIp);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  return (await res.json()) as RecaptchaVerifyResponse;
}

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("SMTP environment variables are not fully configured");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

function getAdminEmail() {
  const adminEmail = process.env.CONTACT_ADMIN_EMAIL || siteConfig.email;
  if (!adminEmail) {
    throw new Error("CONTACT_ADMIN_EMAIL is not configured");
  }
  return adminEmail;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { name, email, subject, message, recaptchaToken, locale } = body;
  const resolvedLocale = resolveLocale(locale);

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  let verification: RecaptchaVerifyResponse;
  try {
    verification = await verifyRecaptcha(recaptchaToken, remoteIp);
  } catch (error) {
    console.error("reCAPTCHA verification failed", error);
    return NextResponse.json({ error: "recaptcha_unavailable" }, { status: 502 });
  }

  if (
    !verification.success ||
    (typeof verification.score === "number" && verification.score < RECAPTCHA_SCORE_THRESHOLD)
  ) {
    return NextResponse.json({ error: "recaptcha_failed" }, { status: 403 });
  }

  const sanitizedSubject = sanitizeHeaderValue(subject);
  const submittedAt = new Date().toLocaleString("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  });

  let transporter: nodemailer.Transporter;
  let adminEmailAddress: string;
  try {
    transporter = getTransporter();
    adminEmailAddress = getAdminEmail();
  } catch (error) {
    console.error("Contact email sending is not configured", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  const adminEmail = renderAdminNotificationEmail({
    name,
    email,
    subject: sanitizedSubject,
    message,
    submittedAt,
  });

  // Notifying the site owner is the critical path: fail the request if it doesn't go out.
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmailAddress,
      replyTo: email,
      subject: adminEmail.subject,
      text: adminEmail.text,
      html: adminEmail.html,
    });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  // The visitor's confirmation copy is best-effort: don't fail the whole
  // request if only this part breaks, the owner's notification already sent.
  try {
    const confirmationEmail = renderVisitorConfirmationEmail({
      name,
      subject: sanitizedSubject,
      message,
      locale: resolvedLocale,
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: confirmationEmail.subject,
      text: confirmationEmail.text,
      html: confirmationEmail.html,
    });
  } catch (error) {
    console.error("Failed to send visitor confirmation email", error);
  }

  return NextResponse.json({ success: true });
}
