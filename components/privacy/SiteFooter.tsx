"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resetCookieConsent } from "@/lib/cookie-consent";
import styles from "./CookieConsent.module.css";

export default function SiteFooter() {
  const t = useTranslations("footer");

  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNavigation} aria-label={t("label")}>
        <Link href="/datenschutz">{t("privacy")}</Link>
        <Link href="/impressum">{t("legalNotice")}</Link>
        <button type="button" onClick={resetCookieConsent}>
          {t("resetCookies")}
        </button>
      </nav>
    </footer>
  );
}
