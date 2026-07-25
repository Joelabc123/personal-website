import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactContent from "@/components/contact/ContactContent";
import StandaloneShell from "@/components/detail/StandaloneShell";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";

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

export default async function ContactPage() {
  const t = await getTranslations("detailRoutes.shell");

  return (
    <StandaloneShell homeLabel={t("backHome")}>
      <ContactContent />
    </StandaloneShell>
  );
}
