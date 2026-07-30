"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageToggle from "@/components/LanguageToggle";
import LocalizedRouteLink from "@/components/detail/LocalizedRouteLink";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./BentoHome.module.css";

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .7A11.5 11.5 0 0 0 8.36 23.1c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.28-1.29-5.28-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.25c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z"
      />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5.34 7.76A2.35 2.35 0 1 0 5.3 3.05a2.35 2.35 0 0 0 .04 4.7ZM3.3 20.95h4.08V9.25H3.3v11.7Zm6.51 0h4.08v-6.53c0-1.72.33-3.39 2.47-3.39 2.1 0 2.13 1.97 2.13 3.5v6.42h4.08v-7.24c0-3.56-.77-6.3-4.93-6.3-2 0-3.33 1.1-3.88 2.14h-.06v-1.8H9.81v13.2Z"
      />
    </svg>
  );
}

function EnvelopeMark() {
  return (
    <svg
      className={styles.envelope}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        className={styles.envelopeFlap}
        d="m3 7 9 6 9-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function HomeUtilityGrid() {
  const t = useTranslations("homeBento.utilities");
  const [menuOpen, setMenuOpen] = useState(false);
  const utilityRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [menuOpen]);

  return (
    <aside
      ref={utilityRef}
      className={styles.utilities}
      aria-label={t("label")}
    >
      <LanguageToggle
        className={`${styles.utilityAction} ${styles.languageAction}`}
      />

      <div className={styles.menuWrap}>
        <button
          type="button"
          className={`${styles.utilityCard} ${styles.utilityAction} ${styles.menuButton}`}
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={menuOpen}
          aria-controls="home-bento-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <X aria-hidden="true" strokeWidth={1.5} />
          ) : (
            <Menu aria-hidden="true" strokeWidth={1.5} />
          )}
        </button>

        {menuOpen ? (
          <div
            ref={menuRef}
            id="home-bento-menu"
            className={styles.menuOverlay}
            role="dialog"
            aria-modal="true"
            aria-label={t("navigationLabel")}
          >
            <div className={styles.menuHeader}>
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.menuClose}
                aria-label={t("closeMenu")}
                onClick={() => setMenuOpen(false)}
              >
                <X aria-hidden="true" strokeWidth={1.5} />
              </button>
            </div>

            <nav
              className={styles.menuNavigation}
              aria-label={t("navigationLabel")}
              onClick={() => setMenuOpen(false)}
            >
              <div className={styles.menuMainLinks}>
                <LocalizedRouteLink href="/cv">{t("cv")}</LocalizedRouteLink>
                <LocalizedRouteLink href="/projects">
                  {t("projects")}
                </LocalizedRouteLink>
                <LocalizedRouteLink href="/travel">
                  {t("travel")}
                </LocalizedRouteLink>
                <LocalizedRouteLink href="/contact">
                  {t("contact")}
                </LocalizedRouteLink>
              </div>

              <div className={styles.menuLegalLinks}>
                <Link href="/datenschutz">{t("datenschutz")}</Link>
                <Link href="/impressum">{t("impressum")}</Link>
              </div>
            </nav>
          </div>
        ) : null}
      </div>

      <a
        className={`${styles.utilityCard} ${styles.utilityAction} ${styles.github}`}
        href={siteConfig.social.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("github")}
        title="GitHub"
      >
        <GitHubMark />
      </a>

      <a
        className={`${styles.utilityCard} ${styles.utilityAction} ${styles.linkedin}`}
        href={siteConfig.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("linkedin")}
        title="LinkedIn"
      >
        <LinkedInMark />
      </a>

      <LocalizedRouteLink
        href="/contact"
        className={`${styles.utilityCard} ${styles.utilityAction} ${styles.contact}`}
      >
        <EnvelopeMark />
        <span className={styles.srOnly}>{t("mail")}</span>
      </LocalizedRouteLink>
    </aside>
  );
}
