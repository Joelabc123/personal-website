import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import LocalizedRouteLink from "@/components/detail/LocalizedRouteLink";
import GalleryLightbox, {
  type LightboxImage,
} from "@/components/travel/GalleryLightbox";
import type { Locale } from "@/lib/cv";
import { getGalleryTrips } from "@/lib/gallery";
import {
  localizeGalleryText,
  type GalleryTrip,
} from "@/lib/gallery-types";
import styles from "./TravelContent.module.css";

type TravelLabels = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  cardDescription: string;
  openTrip: string;
  imageCountOne: string;
  imageCountMany: string;
  back: string;
  gallery: string;
  openImage: string;
  closeLightbox: string;
  previousImage: string;
  nextImage: string;
  imagePosition: string;
};

export function travelTitleId() {
  return "detail-title-travel";
}

export function travelTripTitleId(trip: GalleryTrip) {
  return `detail-title-travel-${trip.year}-${trip.countrySlug}-${trip.tripSlug}`;
}

async function getTravelContext(): Promise<{
  labels: TravelLabels;
  locale: Locale;
}> {
  const [rawLocale, t] = await Promise.all([
    getLocale(),
    getTranslations("travel"),
  ]);

  return {
    locale: rawLocale === "en" ? "en" : "de",
    labels: {
      title: t("title"),
      description: t("description"),
      emptyTitle: t("emptyTitle"),
      emptyDescription: t("emptyDescription"),
      cardDescription: t("cardDescription"),
      openTrip: t("openTrip"),
      imageCountOne: t("imageCountOne"),
      imageCountMany: t("imageCountMany"),
      back: t("back"),
      gallery: t("gallery"),
      openImage: t("openImage"),
      closeLightbox: t("closeLightbox"),
      previousImage: t("previousImage"),
      nextImage: t("nextImage"),
      imagePosition: t("imagePosition"),
    },
  };
}

function imageCountLabel(labels: TravelLabels, count: number) {
  return (count === 1 ? labels.imageCountOne : labels.imageCountMany).replace(
    "%count%",
    String(count),
  );
}

function tripHref(trip: GalleryTrip) {
  return `/travel/${trip.year}/${trip.countrySlug}/${trip.tripSlug}`;
}

function TripHeading({
  trip,
  locale,
}: {
  trip: GalleryTrip;
  locale: Locale;
}) {
  return (
    <div className={styles.tripHeading}>
      <h2>{localizeGalleryText(trip.meta.place, locale)}</h2>
      <span>{trip.year}</span>
    </div>
  );
}

function TripCard({
  trip,
  labels,
  locale,
  preload,
}: {
  trip: GalleryTrip;
  labels: TravelLabels;
  locale: Locale;
  preload: boolean;
}) {
  const place = localizeGalleryText(trip.meta.place, locale);

  return (
    <article className={styles.tripEntry}>
      <TripHeading trip={trip} locale={locale} />
      <LocalizedRouteLink href={tripHref(trip)} className={styles.tripCard}>
        <div className={styles.tripCardMedia}>
          <Image
            src={trip.cover.src}
            alt={localizeGalleryText(trip.cover.alt, locale)}
            width={trip.cover.width}
            height={trip.cover.height}
            sizes="(max-width: 680px) 100vw, (max-width: 1100px) 38vw, 360px"
            quality={90}
            preload={preload}
          />
        </div>
        <div className={styles.tripCardBody}>
          <p className={styles.tripCountry}>
            {localizeGalleryText(trip.meta.country, locale)}
          </p>
          <p className={styles.tripDescription}>
            {labels.cardDescription.replace("%place%", place)}
          </p>
          <div className={styles.tripCardFooter}>
            <span>{imageCountLabel(labels, trip.images.length)}</span>
            <span className={styles.openTrip}>
              {labels.openTrip}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </div>
        </div>
      </LocalizedRouteLink>
    </article>
  );
}

export async function TravelOverview() {
  const { labels, locale } = await getTravelContext();
  const trips = getGalleryTrips();

  return (
    <div className={styles.travel}>
      <header className={styles.overviewHeader}>
        <h1 id={travelTitleId()}>{labels.title}</h1>
        <p>{labels.description}</p>
      </header>

      {trips.length === 0 ? (
        <section className={styles.empty} aria-labelledby="travel-empty-title">
          <div aria-hidden="true" className={styles.emptyVisual}>
            <span />
            <span />
            <span />
          </div>
          <div>
            <h2 id="travel-empty-title">{labels.emptyTitle}</h2>
            <p>{labels.emptyDescription}</p>
          </div>
        </section>
      ) : (
        <section className={styles.tripList} aria-label={labels.gallery}>
          {trips.map((trip, index) => (
            <TripCard
              key={`${trip.year}-${trip.countrySlug}-${trip.tripSlug}`}
              trip={trip}
              labels={labels}
              locale={locale}
              preload={index === 0}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export async function TravelDetail({
  trip,
  showBackLink = true,
}: {
  trip: GalleryTrip;
  showBackLink?: boolean;
}) {
  const { labels, locale } = await getTravelContext();
  const images: LightboxImage[] = trip.images.map((image) => ({
    id: image.id,
    src: image.src,
    width: image.width,
    height: image.height,
    alt: localizeGalleryText(image.alt, locale),
  }));

  return (
    <div className={`${styles.travelDetail} travel-detail-view`}>
      {showBackLink ? (
        <LocalizedRouteLink href="/travel" className={styles.backLink}>
          <ArrowLeft aria-hidden="true" />
          {labels.back}
        </LocalizedRouteLink>
      ) : null}

      <header className={styles.detailHeader}>
        <p className={styles.eyebrow}>
          {localizeGalleryText(trip.meta.country, locale)} · {trip.year}
        </p>
        <h1 id={travelTripTitleId(trip)}>
          {localizeGalleryText(trip.meta.place, locale)}
        </h1>
        <p>{imageCountLabel(labels, images.length)}</p>
      </header>

      <GalleryLightbox
        images={images}
        labels={{
          gallery: labels.gallery,
          openImage: labels.openImage,
          close: labels.closeLightbox,
          previous: labels.previousImage,
          next: labels.nextImage,
          position: labels.imagePosition,
        }}
      />
    </div>
  );
}
