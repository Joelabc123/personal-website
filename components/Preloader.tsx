"use client";

import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";

const EASE = [0.22, 1, 0.36, 1] as const;

// Same wireframe globe/orb icon as the Header logo / the scroll-driven
// WebGL background shape in components/Background.tsx's globeIcon() —
// reproduced locally here rather than shared/imported since it's a small
// self-contained SVG (same convention as the star it replaces).
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

export default function Preloader() {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setIsDone(true), 1100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDone) {
      document.body.style.overflow = "";
    }
  }, [isDone]);

  const [firstName, lastName] = siteConfig.name.split(" ");

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          aria-hidden="true"
        >
          <div className="relative flex items-center justify-center gap-3">
            <div className="flex gap-3 overflow-hidden text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              <span className="overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                >
                  {firstName}
                </motion.span>
              </span>
              <span className="overflow-hidden">
                <motion.span
                  className="block text-accent"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
                >
                  {lastName}
                </motion.span>
              </span>
            </div>
            <motion.div
              className="text-accent"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              aria-hidden="true"
            >
              <GlobeLogo className="h-7 w-7 md:h-9 md:w-9" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
