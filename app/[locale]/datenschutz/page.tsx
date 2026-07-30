import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { asLocale, createLocalizedMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/siteConfig";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = asLocale(rawLocale);
  const t = await getTranslations({
    locale,
    namespace: "metadata.datenschutz",
  });

  return createLocalizedMetadata({
    locale,
    path: "/datenschutz",
    title: t("title"),
    description: t("description"),
  });
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
      <h2 className="legal-section__title">{heading}</h2>
      <div className="legal-card">
        {children}
      </div>
    </section>
  );
}

export default async function DatenschutzPage() {
  const t = await getTranslations("legal");
  const td = await getTranslations("legal.datenschutz");
  const shell = await getTranslations("detailRoutes.shell");

  return (
    <main className="legal-page">
      <Link href="/" className="detail-home-link legal-home-link">
        <ArrowLeft aria-hidden="true" />
        <span>{shell("backHome")}</span>
      </Link>
      <h1 className="legal-page__title">{t("datenschutzTitle")}</h1>

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

      <h2 className="legal-divider-title">{td("mandatoryInfoHeading")}</h2>

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

      <h2 className="legal-divider-title">{td("hostingCdnHeading")}</h2>

      <LegalSection heading={td("hostingProviderHeading")}>
        <p>{td("hostingProviderText1")}</p>
        <p>{td("hostingProviderText2")}</p>
        <p>{td("hostingProviderText3")}</p>
      </LegalSection>

      <LegalSection heading={td("cloudflareHeading")}>
        <p>{td("cloudflareText1")}</p>
        <p>{td("cloudflareText2")}</p>
      </LegalSection>

      <h2 className="legal-divider-title">{td("dataCollectionHeading")}</h2>

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

      <h2 className="legal-divider-title">{td("pluginsToolsHeading")}</h2>

      <LegalSection heading={td("recaptchaHeading")}>
        <p>{td("recaptchaText1")}</p>
        <p>{td("recaptchaText2")}</p>
        <p>{td("recaptchaText3")}</p>
      </LegalSection>

      <p className="legal-notice">{t("privateNotice")}</p>
    </main>
  );
}
