import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("datenschutzTitle") };
}

export default async function DatenschutzPage() {
  const t = await getTranslations("legal");

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:pt-40">
      <h1 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
        {t("datenschutzTitle")}
      </h1>

      <div className="mt-8 rounded-lg border border-tertiary bg-tertiary px-6 py-5 text-sm text-primary">
        {t("disclaimer")}
      </div>

      <p className="mt-8 max-w-prose text-base leading-relaxed text-secondary">
        {t("privateNotice")}
      </p>
    </main>
  );
}
