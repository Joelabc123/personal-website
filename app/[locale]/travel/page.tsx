import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import StandaloneShell from "@/components/detail/StandaloneShell";
import JsonLd from "@/components/seo/JsonLd";
import { TravelOverview } from "@/components/travel/TravelContent";
import { getGalleryTrips } from "@/lib/gallery";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";
import { travelPageJsonLd } from "@/lib/structured-data";

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

export default async function TravelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const [shell, metadata] = await Promise.all([
    getTranslations("detailRoutes.shell"),
    getTranslations({ locale, namespace: "metadata.travel" }),
  ]);

  return (
    <StandaloneShell homeLabel={shell("backHome")}>
      <JsonLd
        data={travelPageJsonLd(
          {
            locale,
            path: "/travel",
            name: metadata("title"),
            description: metadata("description"),
          },
          getGalleryTrips(),
        )}
      />
      <TravelOverview />
    </StandaloneShell>
  );
}
