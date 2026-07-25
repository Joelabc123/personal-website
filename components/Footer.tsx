"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/siteConfig";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>{t("copyright", { year })}</p>
        <nav className="site-footer__links" aria-label={t("supportHeading")}>
          <a
            href={siteConfig.social.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("openSource")}
          </a>
          <Link href="/impressum">{t("impressum")}</Link>
          <Link href="/datenschutz">{t("datenschutz")}</Link>
        </nav>
      </div>
    </footer>
  );
}
