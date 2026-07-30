import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import LocaleProvider, {
  type AppLocale,
} from "@/components/LocaleProvider";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/siteConfig";
import UtilityDock from "@/components/UtilityDock";
import deMessages from "@/messages/de.json";
import enMessages from "@/messages/en.json";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "portfolio",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = {
    de: deMessages,
    en: enMessages,
  };

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <LocaleProvider
          initialLocale={locale as AppLocale}
          messages={messages}
        >
          <UtilityDock />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
