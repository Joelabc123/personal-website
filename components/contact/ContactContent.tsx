import { getTranslations } from "next-intl/server";
import { connection } from "next/server";
import ContactForm from "@/components/ContactForm";
import styles from "./ContactContent.module.css";

export const contactTitleId = "detail-title-contact";

export default async function ContactContent() {
  await connection();

  const t = await getTranslations("contact");
  const recaptchaSiteKey =
    process.env.RECAPTCHA_SITE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ||
    "";

  return (
    <div className={styles.contact}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{t("eyebrow")}</p>
        <h1 id={contactTitleId}>{t("heading")}</h1>
        <p>{t("description")}</p>
      </header>

      <section className={styles.formPanel} aria-label={t("formLabel")}>
        <ContactForm recaptchaSiteKey={recaptchaSiteKey} />
      </section>
    </div>
  );
}
