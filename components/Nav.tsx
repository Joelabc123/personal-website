"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/siteConfig";
import { Link, usePathname } from "@/i18n/navigation";

type NavProps = {
  activeId: string;
  className?: string;
  listClassName?: string;
  onNavigate?: () => void;
};

export default function Nav({
  activeId,
  className = "",
  listClassName = "flex items-center gap-8 text-sm",
  onNavigate,
}: NavProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isActive = (id: string) => isHomePage && activeId === id;

  const handleClick =
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isHomePage) {
        event.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${id}`);
      }
      onNavigate?.();
    };

  return (
    <nav className={className} aria-label="Main">
      <ul className={listClassName}>
        {siteConfig.nav.map((item) => (
          <li key={item.id}>
            <Link
              href={isHomePage ? `#${item.id}` : `/#${item.id}`}
              onClick={handleClick(item.id)}
              aria-current={isActive(item.id) ? "true" : undefined}
              className={`transition-colors ${
                isActive(item.id)
                  ? "font-medium text-primary"
                  : "text-secondary hover:text-primary"
              }`}
            >
              {t(item.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

