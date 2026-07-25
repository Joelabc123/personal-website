"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const languageMeta: Record<string, { label: string }> = {
  de: { label: "Deutsch" },
  en: { label: "English" },
};

function LanguageFlag({ locale }: { locale: string }) {
  if (locale === "de") {
    return (
      <svg
        className="language-flag"
        data-language="de"
        viewBox="0 0 60 36"
        aria-hidden="true"
      >
        <rect width="60" height="12" fill="#181818" />
        <rect y="12" width="60" height="12" fill="#dd0000" />
        <rect y="24" width="60" height="12" fill="#ffce00" />
      </svg>
    );
  }

  return (
    <svg
      className="language-flag"
      data-language="en"
      viewBox="0 0 60 36"
      aria-hidden="true"
    >
      <rect width="60" height="36" fill="#012169" />
      <path d="M0 0 60 36M60 0 0 36" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 60 36M60 0 0 36" stroke="#c8102e" strokeWidth="3" />
      <path d="M30 0v36M0 18h60" stroke="#fff" strokeWidth="12" />
      <path d="M30 0v36M0 18h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}

type LanguageToggleProps = {
  className?: string;
};

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale();
  const t = useTranslations("utility");
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = routing.locales.find((l) => l !== locale) ?? locale;
  const { label } = languageMeta[otherLocale];

  const switchLocale = () => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: otherLocale });
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={t("switchLanguage", { language: label })}
      title={t("switchLanguage", { language: label })}
      className={`utility-button${className ? ` ${className}` : ""}`}
    >
      <LanguageFlag locale={otherLocale} />
    </button>
  );
}

