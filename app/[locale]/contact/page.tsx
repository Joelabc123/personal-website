import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactContent from "@/components/contact/ContactContent";
import StandaloneShell from "@/components/detail/StandaloneShell";
import JsonLd from "@/components/seo/JsonLd";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";
import { contactPageJsonLd } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "metadata.contact" });

  return createLocalizedMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const [shell, metadata] = await Promise.all([
    getTranslations("detailRoutes.shell"),
    getTranslations({ locale, namespace: "metadata.contact" }),
  ]);

  return (
    <StandaloneShell homeLabel={shell("backHome")}>
      <JsonLd
        data={contactPageJsonLd({
          locale,
          path: "/contact",
          name: metadata("title"),
          description: metadata("description"),
        })}
      />
      <ContactContent />
    </StandaloneShell>
  );
}
