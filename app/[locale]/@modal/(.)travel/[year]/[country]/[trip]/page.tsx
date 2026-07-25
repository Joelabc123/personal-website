import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import ModalShell from "@/components/detail/ModalShell";
import {
  TravelDetail,
  travelTripTitleId,
} from "@/components/travel/TravelContent";
import {
  getGalleryStaticParams,
  getGalleryTrip,
} from "@/lib/gallery";
import type { Locale } from "@/lib/cv";
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

export default async function TravelTripModal({
  params,
}: {
  params: Promise<{ year: string; country: string; trip: string }>;
}) {
  const [{ year, country, trip: tripSlug }, locale, t] = await Promise.all([
    params,
    getLocale(),
    getTranslations("detailRoutes.shell"),
  ]);
  const trip = getGalleryTrip(year, country, tripSlug);

  if (!trip) notFound();

  return (
    <ModalShell
      closeLabel={t("close")}
      returnFocusHref={`/${locale}/travel/${year}/${country}/${tripSlug}`}
      titleId={travelTripTitleId(trip)}
    >
      <TravelDetail trip={trip} />
    </ModalShell>
  );
}
