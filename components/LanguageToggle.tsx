"use client";

import type { SVGProps } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Plain SVG flags instead of the 🇩🇪/🇬🇧 flag emoji: Windows' Segoe UI Emoji
// font has no glyphs for regional-indicator flag sequences, so those emoji
// rendered as plain "DE"/"GB" letter-pair fallback text there instead of an
// actual flag — an SVG guarantees the real flag renders on every platform.
function DeFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" {...props}>
      <rect width="60" height="10" y="0" fill="#000000" />
      <rect width="60" height="10" y="10" fill="#DD0000" />
      <rect width="60" height="10" y="20" fill="#FFCE00" />
    </svg>
  );
}

function GbFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" {...props}>
      <rect width="60" height="30" fill="#00247d" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" strokeWidth="2" />
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30 M0,15 H60" stroke="#cf142b" strokeWidth="6" />
    </svg>
  );
}

const languageMeta: Record<string, { Flag: (props: SVGProps<SVGSVGElement>) => React.JSX.Element; label: string }> = {
  de: { Flag: DeFlag, label: "Deutsch" },
  en: { Flag: GbFlag, label: "English" },
};

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // The button always shows the flag of the OTHER language (the one a click
  // would switch to) — e.g. while the site is in English it shows the German
  // flag; clicking it switches the site to German and the button then flips
  // to show the British flag to switch back, and vice versa.
  const otherLocale = routing.locales.find((l) => l !== locale) ?? locale;
  const { Flag, label } = languageMeta[otherLocale];

  const switchLocale = () => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${hash}`, { locale: otherLocale });
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={`Switch to ${label}`}
      className="inline-flex h-6 w-9 items-center justify-center overflow-hidden rounded-sm ring-1 ring-white/20 transition-transform duration-300 hover:scale-105"
    >
      <Flag className="h-full w-full" />
    </button>
  );
}

