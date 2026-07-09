"use client";

import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import MobileMenu from "./MobileMenu";

// Same wireframe globe/orb icon as the scroll-driven WebGL background
// shape in components/Background.tsx's globeIcon() — outer circle ring +
// horizontal equator + vertical meridian line + two meridian arcs forming
// a vertical lens, plus a tiny sparkle accent at the crossing. The two
// meridian arcs are the SAME radius circle through the same two pole
// points, just with the sweep-flag flipped, which automatically mirrors
// the bulge direction (left vs right) without needing separate centers.
function GlobeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={5} strokeLinecap="round" {...props}>
      <circle cx="50" cy="50" r="36" />
      <line x1="14" y1="50" x2="86" y2="50" />
      <line x1="50" y1="14" x2="50" y2="86" />
      <path d="M50 14 A 42.4 42.4 0 0 0 50 86" />
      <path d="M50 14 A 42.4 42.4 0 0 1 50 86" />
      <path
        fill="currentColor"
        stroke="none"
        transform="translate(50 50) scale(0.28) translate(-50 -50)"
        d="M50 8 L58 38 L81 50 L58 62 L50 92 L42 62 L19 50 L42 38 Z"
      />
    </svg>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
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
    <header className="fixed inset-x-0 top-0 z-50">
      {/*
        The scrolled background uses backdrop-blur, but `filter`/`backdrop-filter`
        establish a containing block for `position: fixed` descendants (same as
        `transform`). MobileMenu's full-screen overlay is `fixed inset-0` and is
        nested inside this header, so if the blur lived directly on <header> the
        overlay would size/position itself against the ~64px header box instead
        of the viewport as soon as the user scrolled past the top (i.e. exactly
        in the sections below Hero and in the Footer) — breaking the menu there.
        Keeping the blur on this separate, non-ancestor-of-the-menu decorative
        div avoids that entirely.
      */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-colors duration-300 ${
          isScrolled
            ? "border-b border-white/5 bg-black/80 shadow-lg shadow-black/20 backdrop-blur-md"
            : "bg-transparent"
        }`}
      />
      <div className="relative flex h-16 w-full items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="text-primary transition-transform duration-300 hover:-translate-y-0.5"
        >
          <GlobeLogo className="h-7 w-7" />
        </Link>

        <MobileMenu />
      </div>
    </header>
  );
}

