import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CvContent } from "@/components/cv/CvContent";
import StandaloneShell from "@/components/detail/StandaloneShell";
import JsonLd from "@/components/seo/JsonLd";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";
import { profilePageJsonLd } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata.cv" });

  return createLocalizedMetadata({
    locale,
    path: "/cv",
    title: t("title"),
    description: t("description"),
    openGraphImagePath: "/cv",
  });
}

export default async function CvPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const [shell, metadata] = await Promise.all([
    getTranslations("detailRoutes.shell"),
    getTranslations({ locale, namespace: "metadata.cv" }),
  ]);

  return (
    <StandaloneShell homeLabel={shell("backHome")}>
      <JsonLd
        data={profilePageJsonLd({
          locale,
          path: "/cv",
          name: metadata("title"),
          description: metadata("description"),
        })}
      />
      <CvContent />
    </StandaloneShell>
  );
}
