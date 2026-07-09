import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/siteConfig";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("datenschutzTitle") };
}

function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 first:mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-primary md:text-2xl">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-sm leading-relaxed text-secondary backdrop-blur-sm">
        {children}
      </div>
    </section>
  );
}

export default async function DatenschutzPage() {
  const t = await getTranslations("legal");
  const td = await getTranslations("legal.datenschutz");

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-black" />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:pt-40">
        <h1 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
          {t("datenschutzTitle")}
        </h1>

        <LegalSection heading={td("generalInfoHeading")}>
          <p>{td("generalInfoText")}</p>
        </LegalSection>

        <LegalSection heading={td("responsibleShortHeading")}>
          <p>{td("responsibleShortText")}</p>
        </LegalSection>

        <LegalSection heading={td("collectionMethodHeading")}>
          <p>{td("collectionMethodText")}</p>
        </LegalSection>

        <LegalSection heading={td("dataUsageHeading")}>
          <p>{td("dataUsageText")}</p>
        </LegalSection>

        <h2 className="mt-14 text-lg font-semibold tracking-tight text-primary">
          {td("mandatoryInfoHeading")}
        </h2>

        <LegalSection heading={td("responsiblePartyHeading")}>
          <p>{td("responsiblePartyIntro")}</p>
          <p>
            {siteConfig.name}
            <br />
            {siteConfig.address.street}
            <br />
            {siteConfig.address.zipCity}
            <br />
            {siteConfig.address.country}
          </p>
          <p>
            {td("responsiblePartyEmailLabel")}: {siteConfig.email}
          </p>
          <p>{td("responsiblePartyOutro")}</p>
        </LegalSection>

        <LegalSection heading={td("rightsHeading")}>
          <p>{td("rightsText")}</p>
        </LegalSection>

        <LegalSection heading={td("sslHeading")}>
          <p>{td("sslText")}</p>
        </LegalSection>

        <h2 className="mt-14 text-lg font-semibold tracking-tight text-primary">
          {td("hostingCdnHeading")}
        </h2>

        <LegalSection heading={td("hostingProviderHeading")}>
          <p>{td("hostingProviderText1")}</p>
          <p>{td("hostingProviderText2")}</p>
          <p>{td("hostingProviderText3")}</p>
        </LegalSection>

        <LegalSection heading={td("cloudflareHeading")}>
          <p>{td("cloudflareText1")}</p>
          <p>{td("cloudflareText2")}</p>
        </LegalSection>

        <h2 className="mt-14 text-lg font-semibold tracking-tight text-primary">
          {td("dataCollectionHeading")}
        </h2>

        <LegalSection heading={td("serverLogHeading")}>
          <p>{td("serverLogIntro")}</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>{td("serverLogItem1")}</li>
            <li>{td("serverLogItem2")}</li>
            <li>{td("serverLogItem3")}</li>
            <li>{td("serverLogItem4")}</li>
            <li>{td("serverLogItem5")}</li>
            <li>{td("serverLogItem6")}</li>
          </ul>
          <p>{td("serverLogOutro")}</p>
        </LegalSection>

        <LegalSection heading={td("contactFormHeading")}>
          <p>{td("contactFormText1")}</p>
          <p>{td("contactFormText2")}</p>
          <p>{td("contactFormText3")}</p>
        </LegalSection>

        <h2 className="mt-14 text-lg font-semibold tracking-tight text-primary">
          {td("pluginsToolsHeading")}
        </h2>

        <LegalSection heading={td("recaptchaHeading")}>
          <p>{td("recaptchaText1")}</p>
          <p>{td("recaptchaText2")}</p>
          <p>{td("recaptchaText3")}</p>
        </LegalSection>

        <p className="mt-14 max-w-prose text-sm leading-relaxed text-secondary">
          {t("privateNotice")}
        </p>
      </main>
    </>
  );
}
