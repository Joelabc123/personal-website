import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import StandaloneShell from "@/components/detail/StandaloneShell";
import { TravelOverview } from "@/components/travel/TravelContent";
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

export default async function TravelPage() {
  const t = await getTranslations("detailRoutes.shell");

  return (
    <StandaloneShell homeLabel={t("backHome")}>
      <TravelOverview />
    </StandaloneShell>
  );
}
