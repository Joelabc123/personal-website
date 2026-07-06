"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Isolated on purpose: swapping this for a Server Action later (self-hosted
// email sending) shouldn't require touching the form markup/handlers below.
function buildMailtoHref({ name, email, subject, message }: ContactFormData) {
  const params = new URLSearchParams({
    subject,
    body: `${message}\n\n${name} (${email})`,
  });
  return `mailto:${siteConfig.email}?${params.toString()}`;
}

function submitContactForm(data: ContactFormData) {
  window.location.href = buildMailtoHref(data);
}

const inputClassName =
  "rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-primary outline-none backdrop-blur-sm transition-colors placeholder:text-secondary focus:border-accent focus:bg-white/10";

export default function ContactForm() {
  const t = useTranslations("contact");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    submitContactForm({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-secondary">
          {t("name")}
          <input type="text" name="name" required className={inputClassName} />
        </label>
        <label className="flex flex-col gap-2 text-sm text-secondary">
          {t("email")}
          <input type="email" name="email" required className={inputClassName} />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-secondary">
        {t("subject")}
        <input type="text" name="subject" required className={inputClassName} />
      </label>

      <label className="flex flex-col gap-2 text-sm text-secondary">
        {t("message")}
        <textarea name="message" required rows={5} className={`resize-none ${inputClassName}`} />
      </label>

      <motion.button
        type="submit"
        className="self-start rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:border-accent/60 hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_24px_rgba(56,189,248,0.25)]"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        {t("submit")}
      </motion.button>
    </form>
  );
}
