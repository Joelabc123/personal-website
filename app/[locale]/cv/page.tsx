import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CvContent } from "@/components/cv/CvContent";
import StandaloneShell from "@/components/detail/StandaloneShell";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";

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

export default async function CvPage() {
  const t = await getTranslations("detailRoutes.shell");

  return (
    <StandaloneShell homeLabel={t("backHome")}>
      <CvContent />
    </StandaloneShell>
  );
}
