"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import { Inter } from "next/font/google";
import { useEffect, useSyncExternalStore } from "react";
import ErrorState, {
  errorStateStyles as styles,
} from "@/components/errors/ErrorState";
import {
  type ErrorLocale,
  errorCopy,
  resolveErrorLocale,
} from "@/components/errors/errorCopy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function localeFromPathname(): ErrorLocale {
  if (typeof window === "undefined") return "de";

  return resolveErrorLocale(window.location.pathname.split("/")[1]);
}

function subscribeToLocation() {
  return () => undefined;
}

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const locale = useSyncExternalStore<ErrorLocale>(
    subscribeToLocation,
    localeFromPathname,
    () => "de" as const,
  );
  const copy = errorCopy[locale].internal;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <title>{copy.metadataTitle}</title>
        <ErrorState
          announce
          code="500"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          status={copy.status}
          actions={
            <>
              <button
                type="button"
                className={`${styles.action} ${styles.primaryAction}`}
                onClick={() => unstable_retry()}
              >
                <RotateCcw aria-hidden="true" />
                {copy.retry}
              </button>
              <a
                href={`/${locale}`}
                className={`${styles.action} ${styles.secondaryAction}`}
              >
                <ArrowLeft aria-hidden="true" />
                {copy.home}
              </a>
            </>
          }
        />
      </body>
    </html>
  );
}
