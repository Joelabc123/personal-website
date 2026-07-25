import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BentoHome from "@/components/home/BentoHome";
import JsonLd from "@/components/seo/JsonLd";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";
import { personJsonLd } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return createLocalizedMetadata({
    locale,
    title: t("title"),
    description: t("description"),
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);

  return (
    <>
      <JsonLd data={personJsonLd(locale)} />
      <BentoHome />
    </>
  );
}
