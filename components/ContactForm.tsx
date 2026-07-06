"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/siteConfig";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

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

      <HoverBorderGradient
        as="button"
        containerClassName="self-start"
        className="text-sm font-medium"
      >
        {t("submit")}
      </HoverBorderGradient>
    </form>
  );
}
