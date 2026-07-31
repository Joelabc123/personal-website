import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CvPrintContent } from "@/components/cv/CvContent";
import JsonLd from "@/components/seo/JsonLd";
import { asLocale } from "@/lib/metadata";
import { profilePageJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CvPrintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata.cv" });

  return (
    <main className="cv-print-page">
      <JsonLd
        data={profilePageJsonLd({
          locale,
          path: "/cv/print",
          name: t("title"),
          description: t("description"),
        })}
      />
      <CvPrintContent />
    </main>
  );
}
