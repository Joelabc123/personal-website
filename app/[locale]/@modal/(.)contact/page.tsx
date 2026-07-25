import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import ContactContent, {
  contactTitleId,
} from "@/components/contact/ContactContent";
import ModalShell from "@/components/detail/ModalShell";
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

export default async function ContactModal() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("detailRoutes.shell"),
  ]);

  return (
    <ModalShell
      closeLabel={t("close")}
      returnFocusHref={`/${locale}/contact`}
      titleId={contactTitleId}
    >
      <ContactContent />
    </ModalShell>
  );
}
