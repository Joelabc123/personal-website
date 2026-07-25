import { getTranslations } from "next-intl/server";
import {
  openGraphImageContentType,
  openGraphImageSize,
  renderOpenGraphImage,
} from "@/components/seo/OpenGraphImage";
import { asLocale } from "@/lib/metadata";

export const alt = "Joel Bakirel projects";
export const size = openGraphImageSize;
export const contentType = openGraphImageContentType;

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata.projects" });

  return renderOpenGraphImage({
    eyebrow: t("eyebrow"),
    title: t("ogTitle"),
    description: t("description"),
    accent: "#bb71e9",
  });
}
