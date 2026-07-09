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
  return { title: t("impressumTitle") };
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

export default async function ImpressumPage() {
  const t = await getTranslations("legal");
  const ti = await getTranslations("legal.impressum");

  return (
    <>
      <div className="fixed inset-0 -z-10 bg-black" />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:pt-40">
        <h1 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
          {t("impressumTitle")}
        </h1>

        <LegalSection heading={ti("providerHeading")}>
          <p>{siteConfig.name}</p>
          <p>{siteConfig.address.street}</p>
          <p>{siteConfig.address.zipCity}</p>
          <p>{siteConfig.address.country}</p>
        </LegalSection>

        <LegalSection heading={ti("contactHeading")}>
          <p>
            {ti("contactEmailLabel")}: {siteConfig.email}
          </p>
        </LegalSection>

        <LegalSection heading={ti("responsibleHeading")}>
          <p>{siteConfig.name}</p>
          <p>{siteConfig.address.street}</p>
          <p>{siteConfig.address.zipCity}</p>
        </LegalSection>

        <LegalSection heading={ti("hostingHeading")}>
          <div>
            <p className="font-semibold">{ti("hostingWebHeading")}</p>
            <p className="mt-2">netcup GmbH</p>
            <p>Emmy-Noether-Straße 10</p>
            <p>D-76131 Karlsruhe</p>
            <p>Deutschland</p>
            <p className="mt-4">
              {ti("hostingPhoneLabel")}: +49 721 / 7540755 - 0
            </p>
            <p>{ti("hostingFaxLabel")}: +49 721 / 7540755 - 9</p>
            <p>{ti("hostingEmailLabel")}: mail@netcup.de</p>
            <p>{ti("hostingWebLabel")}: www.netcup.com</p>
            <p>
              {ti("hostingRegisterLabel")}: HRB 705547, Amtsgericht Mannheim
            </p>
          </div>

          <div>
            <p className="font-semibold">{ti("hostingEmailHeading")}</p>
            <p className="mt-2">NUXOA GmbH</p>
            <p>Hauptstraße 20a</p>
            <p>82216 Maisach</p>
            <p>Deutschland</p>
            <p className="mt-4">
              {ti("hostingManagementLabel")}: Maximilian Dallmair, Richard
              Reiber
            </p>
            <p>{ti("hostingPhoneLabel")}: +49 8141 31589006</p>
            <p>{ti("hostingFaxLabel")}: +49 8141 31589001</p>
            <p>{ti("hostingEmailLabel")}: info@st-hosting.com</p>
          </div>
        </LegalSection>

        <LegalSection heading={ti("liabilityContentHeading")}>
          <p>{ti("liabilityContentText1")}</p>
          <p>{ti("liabilityContentText2")}</p>
        </LegalSection>

        <LegalSection heading={ti("liabilityLinksHeading")}>
          <p>{ti("liabilityLinksText1")}</p>
          <p>{ti("liabilityLinksText2")}</p>
        </LegalSection>

        <LegalSection heading={ti("copyrightHeading")}>
          <p>{ti("copyrightText1")}</p>
          <p>{ti("copyrightText2")}</p>
        </LegalSection>
      </main>
    </>
  );
}
