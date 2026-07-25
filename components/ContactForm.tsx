"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import styles from "./ContactForm.module.css";

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

export default function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status === "success" || status === "error") {
      statusRef.current?.focus({ preventScroll: true });
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "sending") {
      return;
    }

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
          id="contact-recaptcha-v3"
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      )}
      <form
        onSubmit={handleSubmit}
        className={styles.form}
        aria-busy={status === "sending"}
      >
        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>{t("name")}</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              className={styles.control}
            />
          </label>
          <label className={styles.field}>
            <span>{t("email")}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              className={styles.control}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>{t("subject")}</span>
          <input
            type="text"
            name="subject"
            autoComplete="off"
            required
            className={styles.control}
          />
        </label>

        <label className={styles.field}>
          <span>{t("message")}</span>
          <textarea
            name="message"
            required
            rows={6}
            className={`${styles.control} ${styles.textarea}`}
          />
        </label>

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={status === "sending"}
            className={styles.submit}
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>

          <p
            ref={statusRef}
            className={[
              styles.status,
              status === "success" ? styles.success : "",
              status === "error" ? styles.error : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role={status === "error" ? "alert" : "status"}
            aria-live={status === "error" ? "assertive" : "polite"}
            aria-atomic="true"
            tabIndex={status === "success" || status === "error" ? -1 : undefined}
          >
            {status === "sending"
              ? t("sending")
              : status === "success"
                ? t("success")
                : status === "error"
                  ? t("error")
                  : ""}
          </p>
        </div>

        {RECAPTCHA_SITE_KEY && (
          <p className={styles.recaptchaNotice}>
            {t.rich("recaptchaNotice", {
              privacy: (chunks) => (
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {chunks}
                </a>
              ),
              terms: (chunks) => (
                <a
                  href="https://policies.google.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
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
