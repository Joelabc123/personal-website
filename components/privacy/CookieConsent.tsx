"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  setCookieConsent,
  useCookieConsent,
} from "@/lib/cookie-consent";
import styles from "./CookieConsent.module.css";

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const consent = useCookieConsent();

  if (consent !== null) return null;

  return (
    <section
      className={styles.banner}
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <p className={styles.eyebrow}>{t("eyebrow")}</p>
      <h2 id="cookie-consent-title" className={styles.title}>
        {t("title")}
      </h2>
      <p id="cookie-consent-description" className={styles.description}>
        {t("description")} {" "}
        <Link href="/datenschutz">{t("privacyLink")}</Link>
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.action} ${styles.reject}`}
          onClick={() => setCookieConsent("rejected")}
        >
          {t("rejectAll")}
        </button>
        <button
          type="button"
          className={`${styles.action} ${styles.accept}`}
          onClick={() => setCookieConsent("accepted")}
        >
          {t("acceptAll")}
        </button>
      </div>
    </section>
  );
}
