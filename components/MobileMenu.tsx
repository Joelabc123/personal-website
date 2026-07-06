"use client";

import { useState } from "react";
import Nav from "./Nav";
import LanguageToggle from "./LanguageToggle";

type MobileMenuProps = {
  activeId: string;
};

export default function MobileMenu({ activeId }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="flex h-8 w-8 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-px w-6 bg-primary transition-transform duration-200 ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-px w-6 bg-primary transition-opacity duration-200 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-px w-6 bg-primary transition-transform duration-200 ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-16 flex flex-col gap-8 border-t border-white/10 bg-[#181d25]/95 px-6 py-8 shadow-lg shadow-black/30 backdrop-blur-md">
          <Nav
            activeId={activeId}
            listClassName="flex flex-col gap-6 text-base"
            onNavigate={() => setIsOpen(false)}
          />
          <LanguageToggle />
        </div>
      )}
    </div>
  );
}

