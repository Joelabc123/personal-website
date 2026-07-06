import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/siteConfig";
import Header from "@/components/Header";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import FluentGlass from "@/components/FluentGlass";
import CustomCursor from "@/components/CustomCursor";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: `${siteConfig.name} — personal portfolio and CV.`,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `${siteConfig.url}/${locale}`])
    ),
  },
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

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <FluentGlass />
          <CustomCursor />
          <Preloader />
          <Header />
          <ScrollProgress />
          {children}
          <Footer />
          <BackToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
