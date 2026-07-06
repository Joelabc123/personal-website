"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", window.location.pathname + window.location.search);
  };

  return (
    <motion.button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-primary shadow-lg shadow-black/30 backdrop-blur-md transition-colors hover:border-accent/60 hover:bg-accent/10 hover:text-accent"
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </motion.button>
  );
}
