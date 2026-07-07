"use client";

import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import { useActiveSection } from "@/lib/useActiveSection";
import { Link, usePathname } from "@/i18n/navigation";
import Nav from "./Nav";
import LanguageToggle from "./LanguageToggle";
import MobileMenu from "./MobileMenu";

const sectionIds = siteConfig.nav.map((item) => item.id);

// Same 4-pointed sparkle silhouette as the scroll-driven WebGL background
// star in components/Background.tsx (there it's the union/min of two
// elongated diamonds — a taller vertical spike, shorter horizontal spikes —
// which is a piecewise-linear octagon, so it maps exactly onto a flat SVG
// polygon instead of needing curves).
function StarLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <path d="M50 8 L58 38 L81 50 L58 62 L50 92 L42 62 L19 50 L42 38 Z" />
    </svg>
  );
}

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
          ? "border-b border-white/5 bg-black/80 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="text-primary transition-transform duration-300 hover:-translate-y-0.5"
        >
          <StarLogo className="h-7 w-7" />
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

