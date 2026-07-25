"use client";

import { useTranslations } from "next-intl";
import LanguageToggle from "@/components/LanguageToggle";
import { usePathname } from "@/i18n/navigation";

export default function UtilityDock() {
  const t = useTranslations("utility");
  const pathname = usePathname();
  const detailRoutes = ["/cv", "/projects", "/travel", "/contact"];
  const legalRoutes = ["/datenschutz", "/impressum"];
  const isDetailRoute = detailRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isLegalRoute = legalRoutes.includes(pathname);

  if (pathname === "/" || isDetailRoute || isLegalRoute) {
    return null;
  }

  return (
    <aside className="utility-dock" aria-label={t("label")}>
      <LanguageToggle />
    </aside>
  );
}
