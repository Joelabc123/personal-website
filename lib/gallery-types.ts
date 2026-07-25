import type { Locale, LocalizedText, YearMonth } from "@/lib/cv";

export type GalleryLayout = "wide" | "tall" | "square";

export type GalleryMeta = {
  country: LocalizedText;
  place: LocalizedText;
  date?: YearMonth;
  cover?: string;
  order?: number;
  collapsed?: boolean | "auto";
  layout?: Readonly<Record<string, GalleryLayout>>;
};

export type GalleryImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  alt: LocalizedText;
  layout: GalleryLayout;
};

export type GalleryTrip = {
  year: number;
  countrySlug: string;
  tripSlug: string;
  meta: GalleryMeta;
  cover: GalleryImage;
  images: readonly GalleryImage[];
  collapsed: boolean;
};

export type GalleryManifest = {
  version: 1;
  trips: readonly GalleryTrip[];
};

export function localizeGalleryText(
  value: LocalizedText,
  locale: Locale,
): string {
  return value[locale];
}
