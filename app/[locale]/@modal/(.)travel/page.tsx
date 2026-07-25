import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import ModalShell from "@/components/detail/ModalShell";
import {
  TravelOverview,
  travelTitleId,
} from "@/components/travel/TravelContent";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata.travel" });

  return createLocalizedMetadata({
    locale,
    path: "/travel",
    title: t("title"),
    description: t("description"),
    openGraphImagePath: "/travel",
  });
}

export default async function TravelModal() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("detailRoutes.shell"),
  ]);

  return (
    <ModalShell
      closeLabel={t("close")}
      returnFocusHref={`/${locale}/travel`}
      titleId={travelTitleId()}
    >
      <TravelOverview />
    </ModalShell>
  );
}
