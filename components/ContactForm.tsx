"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { GlowingEffect } from "@/components/ui/glowing-effect";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
};

type SubmitStatus = "idle" | "sending" | "success" | "error";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function getRecaptchaToken(): Promise<string> {
  if (!RECAPTCHA_SITE_KEY || !window.grecaptcha) {
    return Promise.reject(new Error("reCAPTCHA is not available"));
  }
  const siteKey = RECAPTCHA_SITE_KEY;
  return new Promise((resolve, reject) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!.execute(siteKey, { action: "contact" }).then(resolve).catch(reject);
    });
  });
}

// Isolated on purpose: this is the single place that talks to the API route,
// keeping the reCAPTCHA + fetch details out of the form markup/handler below.
async function submitContactForm(data: ContactFormData) {
  const recaptchaToken = await getRecaptchaToken();

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, recaptchaToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit contact form");
  }
}

const inputClassName =
  "rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-primary outline-none backdrop-blur-sm transition-colors placeholder:text-secondary focus:border-accent focus:bg-white/10";

export default function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    try {
      await submitContactForm({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
        locale,
      });
      setStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-secondary">
            {t("name")}
            <input type="text" name="name" required className={inputClassName} />
          </label>
          <label className="flex flex-col gap-2 text-sm text-secondary">
            {t("email")}
            <input type="email" name="email" required className={inputClassName} />
          </label>
        </div>

        <label className="flex flex-col gap-2 text-sm text-secondary">
          {t("subject")}
          <input type="text" name="subject" required className={inputClassName} />
        </label>

        <label className="flex flex-col gap-2 text-sm text-secondary">
          {t("message")}
          <textarea name="message" required rows={5} className={`resize-none ${inputClassName}`} />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative self-start rounded-full border border-white/10 p-1">
            <GlowingEffect
              variant="white"
              spread={40}
              glow
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="relative block rounded-full bg-white/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? t("sending") : t("submit")}
            </button>
          </div>

          {status === "success" && <p className="text-sm text-accent">{t("success")}</p>}
          {status === "error" && <p className="text-sm text-red-400">{t("error")}</p>}
        </div>

        {RECAPTCHA_SITE_KEY && (
          <p className="text-xs text-secondary">
            {t.rich("recaptchaNotice", {
              privacy: (chunks) => (
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-accent"
                >
                  {chunks}
                </a>
              ),
              terms: (chunks) => (
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-accent"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        )}
      </form>
    </>
  );
}
