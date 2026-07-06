"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

export default function ScrollProgress() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setOverall(
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!isHomePage) return null;

  return (
    <div
      className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      aria-hidden="true"
    >
      <div className="relative h-56 w-px bg-tertiary">
        <div
          className="absolute inset-x-0 top-0 w-px bg-primary transition-[height] duration-150 ease-out"
          style={{ height: `${overall * 100}%` }}
        />
        <span
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-[top] duration-150 ease-out"
          style={{ top: `${overall * 100}%` }}
        />
      </div>
    </div>
  );
}

