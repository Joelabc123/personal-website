import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["de", "en"],
  // Used when no locale matches
  defaultLocale: "de",
  // Always show the locale prefix (e.g. /de, /en)
  localePrefix: "always",
  // No cookies are set by this site
  localeCookie: false,
});
