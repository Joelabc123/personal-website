"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { routing } from "@/i18n/routing";

export type AppLocale = (typeof routing.locales)[number];

type LocaleMessages = Record<AppLocale, AbstractIntlMessages>;

type LocaleContextValue = {
  setLocale: (locale: AppLocale) => void;
};

type LocaleProviderProps = {
  children: React.ReactNode;
  initialLocale: AppLocale;
  messages: LocaleMessages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function localizePathname(pathname: string, locale: AppLocale) {
  const segments = pathname.split("/");
  const currentLocale = segments[1];

  if (routing.locales.some((supported) => supported === currentLocale)) {
    segments[1] = locale;
  } else {
    segments.splice(1, 0, locale);
  }

  return segments.join("/") || `/${locale}`;
}

export default function LocaleProvider({
  children,
  initialLocale,
  messages,
}: LocaleProviderProps) {
  const [locale, setCurrentLocale] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: AppLocale) => {
    setCurrentLocale(nextLocale);
    document.documentElement.lang = nextLocale;

    const { hash, pathname, search } = window.location;
    const localizedPathname = localizePathname(pathname, nextLocale);
    window.history.replaceState(
      null,
      "",
      `${localizedPathname}${search}${hash}`,
    );
  }, []);

  const contextValue = useMemo(() => ({ setLocale }), [setLocale]);

  return (
    <LocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages[locale]}
        timeZone="Europe/Berlin"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocaleSwitcher() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocaleSwitcher must be used within LocaleProvider.");
  }

  return context;
}
