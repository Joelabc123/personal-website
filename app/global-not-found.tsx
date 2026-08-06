import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLocale } from "next-intl/server";
import ErrorState, {
  errorStateStyles as styles,
} from "@/components/errors/ErrorState";
import {
  errorCopy,
  resolveErrorLocale,
} from "@/components/errors/errorCopy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

async function getErrorLocale() {
  return resolveErrorLocale(await getLocale());
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getErrorLocale();
  const copy = errorCopy[locale].notFound;

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
  };
}

export default async function GlobalNotFound() {
  const locale = await getErrorLocale();
  const copy = errorCopy[locale].notFound;

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ErrorState
          code="404"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          status={copy.status}
          actions={
            <>
              <a
                href={`/${locale}`}
                className={`${styles.action} ${styles.primaryAction}`}
              >
                <ArrowLeft aria-hidden="true" />
                {copy.home}
              </a>
              <a
                href={`/${locale}/projects`}
                className={`${styles.action} ${styles.secondaryAction}`}
              >
                {copy.projects}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </>
          }
        />
      </body>
    </html>
  );
}
