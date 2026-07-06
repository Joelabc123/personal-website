"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  const handleToggle = () => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: otherLocale });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Switch language"
      className="flex items-center gap-1 text-sm font-medium"
    >
      <span className={locale === "de" ? "text-primary" : "text-secondary"}>
        DE
      </span>
      <span className="text-secondary">/</span>
      <span className={locale === "en" ? "text-primary" : "text-secondary"}>
        EN
      </span>
    </button>
  );
}

