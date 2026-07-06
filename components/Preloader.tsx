"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";

const EASE = [0.22, 1, 0.36, 1] as const;

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1117]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          aria-hidden="true"
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
