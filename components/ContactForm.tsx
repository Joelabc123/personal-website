"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import {
  resetCookieConsent,
  useCookieConsent,
} from "@/lib/cookie-consent";
import styles from "./ContactForm.module.css";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
};

type SubmitStatus = "idle" | "sending" | "success" | "error";
type RecaptchaStatus = "idle" | "ready" | "error";

type ContactFormProps = {
  recaptchaSiteKey: string;
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function getRecaptchaToken(siteKey: string): Promise<string> {
  if (!siteKey || !window.grecaptcha) {
    return Promise.reject(new Error("reCAPTCHA is not available"));
  }

  return new Promise((resolve, reject) => {
    window.grecaptcha!.ready(() => {
      window.grecaptcha!
        .execute(siteKey, { action: "contact" })
        .then(resolve)
        .catch(reject);
    });
  });
}

// Isolated on purpose: this is the single place that talks to the API route,
// keeping the reCAPTCHA + fetch details out of the form markup/handler below.
async function submitContactForm(data: ContactFormData, recaptchaSiteKey: string) {
  const recaptchaToken = await getRecaptchaToken(recaptchaSiteKey);

  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, recaptchaToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit contact form");
  }
}

export default function ContactForm({ recaptchaSiteKey }: ContactFormProps) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const cookieConsent = useCookieConsent();
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [recaptchaStatus, setRecaptchaStatus] =
    useState<RecaptchaStatus>("idle");
  const statusRef = useRef<HTMLParagraphElement>(null);
  const hasRecaptchaSiteKey = Boolean(recaptchaSiteKey);
  const recaptchaNeedsConsent =
    hasRecaptchaSiteKey && cookieConsent !== "accepted";
  const recaptchaUnavailable =
    !hasRecaptchaSiteKey ||
    (cookieConsent === "accepted" && recaptchaStatus === "error");
  const canSubmit =
    hasRecaptchaSiteKey &&
    cookieConsent === "accepted" &&
    recaptchaStatus === "ready";

  useEffect(() => {
    if (status === "success" || status === "error") {
      statusRef.current?.focus({ preventScroll: true });
    }
  }, [status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "sending" || !canSubmit) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    try {
      await submitContactForm(
        {
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          subject: String(formData.get("subject") ?? ""),
          message: String(formData.get("message") ?? ""),
          locale,
        },
        recaptchaSiteKey,
      );
      setStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      {hasRecaptchaSiteKey && cookieConsent === "accepted" && (
        <Script
          id="contact-recaptcha-v3"
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
          onReady={() =>
            setRecaptchaStatus(window.grecaptcha ? "ready" : "error")
          }
          onError={() => setRecaptchaStatus("error")}
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
            disabled={status === "sending" || !canSubmit}
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

        {recaptchaUnavailable ? (
          <div className={styles.consentNotice} role="status">
            <p>{t("recaptchaUnavailable")}</p>
          </div>
        ) : recaptchaNeedsConsent ? (
          <div className={styles.consentNotice}>
            <p>{t("recaptchaConsentRequired")}</p>
            <button type="button" onClick={resetCookieConsent}>
              {t("openCookieSettings")}
            </button>
          </div>
        ) : recaptchaStatus === "ready" ? (
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
        ) : (
          <p className={styles.recaptchaNotice}>{t("recaptchaLoading")}</p>
        )}
      </form>
    </>
  );
}
