"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { useActiveSection } from "@/lib/useActiveSection";
import { Link, usePathname } from "@/i18n/navigation";
import Nav from "./Nav";
import LanguageToggle from "./LanguageToggle";
import MobileMenu from "./MobileMenu";

const sectionIds = siteConfig.nav.map((item) => item.id);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const activeId = useActiveSection(sectionIds);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "border-b border-white/5 bg-[#181d25]/80 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="text-lg font-semibold tracking-wide text-primary"
        >
          JB
        </Link>

        <Nav activeId={activeId} className="hidden md:block" />

        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <LanguageToggle />
          </div>
          <MobileMenu activeId={activeId} />
        </div>
      </div>
    </header>
  );
}

