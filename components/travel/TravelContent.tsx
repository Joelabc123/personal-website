import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Images } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import ModalRouteLink from "@/components/detail/ModalRouteLink";
import GalleryLightbox, {
  type LightboxImage,
} from "@/components/travel/GalleryLightbox";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/cv";
import { getGalleryTrips } from "@/lib/gallery";
import {
  localizeGalleryText,
  type GalleryTrip,
} from "@/lib/gallery-types";
import styles from "./TravelContent.module.css";

type TravelLabels = {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
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
      eyebrow: t("eyebrow"),
      title: t("title"),
      description: t("description"),
      emptyTitle: t("emptyTitle"),
      emptyDescription: t("emptyDescription"),
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
      <div>
        <p>{localizeGalleryText(trip.meta.country, locale)}</p>
        <h2>{localizeGalleryText(trip.meta.place, locale)}</h2>
      </div>
      <span>{trip.year}</span>
    </div>
  );
}

function CollapsedTripCard({
  trip,
  labels,
  locale,
}: {
  trip: GalleryTrip;
  labels: TravelLabels;
  locale: Locale;
}) {
  return (
    <ModalRouteLink href={tripHref(trip)} className={styles.collapsedCard}>
      <Image
        src={trip.cover.src}
        alt={localizeGalleryText(trip.cover.alt, locale)}
        width={trip.cover.width}
        height={trip.cover.height}
        sizes="(max-width: 720px) 100vw, 760px"
      />
      <div className={styles.photoShade} />
      <div className={styles.collapsedBody}>
        <TripHeading trip={trip} locale={locale} />
        <span className={styles.count}>
          <Images aria-hidden="true" />
          {imageCountLabel(labels, trip.images.length)}
        </span>
      </div>
      <span className={styles.openTrip}>
        {labels.openTrip}
        <ArrowUpRight aria-hidden="true" />
      </span>
    </ModalRouteLink>
  );
}

function ExpandedTripCard({
  trip,
  labels,
  locale,
}: {
  trip: GalleryTrip;
  labels: TravelLabels;
  locale: Locale;
}) {
  return (
    <article className={styles.expandedCard}>
      <TripHeading trip={trip} locale={locale} />
      <div className={styles.previewGrid}>
        {trip.images.map((image, index) => (
          <ModalRouteLink
            key={image.id}
            href={tripHref(trip)}
            className={`${styles.previewImage} ${styles[image.layout]}`}
          >
            <Image
              src={image.src}
              alt={localizeGalleryText(image.alt, locale)}
              width={image.width}
              height={image.height}
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 360px"
            />
            <span className={styles.srOnly}>
              {labels.openTrip} ({index + 1}/{trip.images.length})
            </span>
          </ModalRouteLink>
        ))}
      </div>
      <ModalRouteLink href={tripHref(trip)} className={styles.tripLink}>
        {labels.openTrip}
        <ArrowUpRight aria-hidden="true" />
      </ModalRouteLink>
    </article>
  );
}

export async function TravelOverview() {
  const { labels, locale } = await getTravelContext();
  const trips = getGalleryTrips();
  const years = [...new Set(trips.map((trip) => trip.year))];

  return (
    <div className={styles.travel}>
      <header className={styles.overviewHeader}>
        <p className={styles.eyebrow}>{labels.eyebrow}</p>
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
        <div className={styles.years}>
          {years.map((year) => (
            <section
              key={year}
              className={styles.yearGroup}
              aria-labelledby={`travel-year-${year}`}
            >
              <h2 id={`travel-year-${year}`}>{year}</h2>
              <div className={styles.tripList}>
                {trips
                  .filter((trip) => trip.year === year)
                  .map((trip) =>
                    trip.collapsed ? (
                      <CollapsedTripCard
                        key={`${trip.countrySlug}-${trip.tripSlug}`}
                        trip={trip}
                        labels={labels}
                        locale={locale}
                      />
                    ) : (
                      <ExpandedTripCard
                        key={`${trip.countrySlug}-${trip.tripSlug}`}
                        trip={trip}
                        labels={labels}
                        locale={locale}
                      />
                    ),
                  )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export async function TravelDetail({ trip }: { trip: GalleryTrip }) {
  const { labels, locale } = await getTravelContext();
  const images: LightboxImage[] = trip.images.map((image) => ({
    id: image.id,
    src: image.src,
    width: image.width,
    height: image.height,
    alt: localizeGalleryText(image.alt, locale),
    layout: image.layout,
  }));

  return (
    <div className={styles.travelDetail}>
      <Link href="/travel" className={styles.backLink}>
        <ArrowLeft aria-hidden="true" />
        {labels.back}
      </Link>

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
