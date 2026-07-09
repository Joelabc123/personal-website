"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/siteConfig";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageToggle from "./LanguageToggle";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // home/werdegang/kontakt are same-page scroll targets (href always "/",
  // scrollIntoView on click when already on the homepage); impressum/
  // datenschutz are real separate routes, so they get their own href and
  // just navigate normally instead of being intercepted by scroll logic.
  const scrollableIds = ["home", ...siteConfig.nav.map((item) => item.id)];
  const items = [
    { id: "home", label: t("home"), href: "/" },
    ...siteConfig.nav.map((item) => ({ id: item.id, label: t(item.labelKey), href: "/" })),
    { id: "impressum", label: tFooter("impressum"), href: "/impressum" },
    { id: "datenschutz", label: tFooter("datenschutz"), href: "/datenschutz" },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleItemClick = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage && scrollableIds.includes(id)) {
      event.preventDefault();
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", window.location.pathname + window.location.search);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="relative z-50 rounded-md bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-black transition-opacity hover:opacity-80"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-black/95 px-6 pb-10 pt-28 backdrop-blur-md sm:px-10">
          <nav aria-label="Main">
            <ul className="group/menu border-t border-white/10">
              {items.map((item, index) => (
                <li key={item.id} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onClick={handleItemClick(item.id)}
                    className="flex items-center justify-between py-5 text-4xl font-bold uppercase tracking-tight text-primary transition-colors duration-300 group-hover/menu:text-white/30 hover:!text-primary focus-visible:!text-primary sm:text-5xl md:text-6xl"
                  >
                    <span>
                      <span className="mr-2 align-super text-base font-normal">+</span>
                      {item.label}
                    </span>
                    <span className="text-sm font-normal tracking-widest text-secondary">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-6 text-sm uppercase tracking-widest text-secondary">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <Link
                href="/"
                onClick={handleItemClick("kontakt")}
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                {t("contact")}
              </Link>
            </div>
            <LanguageToggle />
          </div>
        </div>
      )}
    </div>
  );
}

