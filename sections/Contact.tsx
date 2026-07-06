import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export default async function Contact() {
  const t = await getTranslations("contact");

  return (
    <section id="kontakt" className="px-6 py-24 md:py-32">
      <div className="mx-auto w-full max-w-2xl">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {t("heading")}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
