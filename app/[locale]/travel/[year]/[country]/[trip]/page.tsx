import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import StandaloneShell from "@/components/detail/StandaloneShell";
import { TravelDetail } from "@/components/travel/TravelContent";
import type { Locale } from "@/lib/cv";
import {
  getGalleryStaticParams,
  getGalleryTrip,
} from "@/lib/gallery";
import { localizeGalleryText } from "@/lib/gallery-types";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGalleryStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    year: string;
    country: string;
    trip: string;
  }>;
}): Promise<Metadata> {
  const {
    locale: rawLocale,
    year,
    country,
    trip: tripSlug,
  } = await params;
  const locale: Locale = asLocale(rawLocale);
  const trip = getGalleryTrip(year, country, tripSlug);

  if (!trip) notFound();

  const t = await getTranslations({ locale, namespace: "metadata.travel" });
  const place = localizeGalleryText(trip.meta.place, locale);
  const countryName = localizeGalleryText(trip.meta.country, locale);

  return createLocalizedMetadata({
    locale,
    path: `/travel/${trip.year}/${trip.countrySlug}/${trip.tripSlug}`,
    title: t("tripTitle", { place, year: trip.year }),
    description: t("tripDescription", {
      place,
      country: countryName,
      year: trip.year,
    }),
    openGraphImagePath: "/travel",
  });
}

export default async function TravelTripPage({
  params,
}: {
  params: Promise<{ year: string; country: string; trip: string }>;
}) {
  const { year, country, trip: tripSlug } = await params;
  const trip = getGalleryTrip(year, country, tripSlug);

  if (!trip) notFound();

  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("travel"),
  ]);

  return (
    <StandaloneShell
      homeLabel={t("back")}
      homeHref={`/${locale}/travel`}
      documentNavigation
    >
      <TravelDetail trip={trip} showBackLink={false} />
    </StandaloneShell>
  );
}
