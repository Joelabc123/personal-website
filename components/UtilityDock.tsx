"use client";

import { useTranslations } from "next-intl";
import LanguageToggle from "@/components/LanguageToggle";
import { usePathname } from "@/i18n/navigation";

export default function UtilityDock() {
  const t = useTranslations("utility");
  const pathname = usePathname();
  const detailRoutes = ["/cv", "/projects", "/travel", "/contact"];
  const isDetailRoute = detailRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (pathname === "/" || isDetailRoute) {
    return null;
  }

  return (
    <aside className="utility-dock" aria-label={t("label")}>
      <LanguageToggle />
    </aside>
  );
}
