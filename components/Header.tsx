"use client";

import { useEffect, useState } from "react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <div className="relative flex h-16 w-full items-center justify-end px-6 sm:px-10">
        <MobileMenu />
      </div>
    </header>
  );
}

