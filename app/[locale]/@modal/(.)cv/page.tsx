import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { CvContent } from "@/components/cv/CvContent";
import ModalShell from "@/components/detail/ModalShell";
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

export default async function CvModal() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("detailRoutes.shell"),
  ]);

  return (
    <ModalShell
      closeLabel={t("close")}
      returnFocusHref={`/${locale}/cv`}
      titleId="detail-title-cv"
    >
      <CvContent />
    </ModalShell>
  );
}
