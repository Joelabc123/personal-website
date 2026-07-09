"use client";

import type { SVGProps } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { siteConfig } from "@/lib/siteConfig";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.71 5.4-5.29 5.68.42.36.78 1.07.78 2.16v3.2c0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.27 2.38 4.27 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m4 6 8 7 8-7" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const year = new Date().getFullYear();

  const socialLinks = [
    { href: siteConfig.social.github, label: "GitHub", Icon: GithubIcon },
    { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: `mailto:${siteConfig.email}`, label: "Email", Icon: MailIcon },
  ];

  const pageLinks = [
    { href: "/", id: null, label: tNav("home") },
    { href: "/", id: "werdegang", label: tNav("journey") },
    { href: "/", id: "kontakt", label: tNav("contact") },
  ];

  const handlePageLinkClick = (id: string | null) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage && id) {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className={`relative border-t border-tertiary px-6 sm:px-10 ${
        isHomePage ? "pt-16 pb-10" : "pt-10 pb-8"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        {/* Brand + Pages/Support link columns */}
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="text-sm font-semibold text-primary">{siteConfig.name}</p>
            <p className="mt-2 text-sm text-secondary">{t("tagline")}</p>
          </div>

          <div
            className={
              isHomePage
                ? "flex flex-col gap-10"
                : "flex flex-col gap-10 sm:flex-row sm:gap-16"
            }
          >
            <div>
              <p className="text-sm font-semibold text-primary">{t("pagesHeading")}</p>
              <ul className="mt-4 space-y-3 text-sm text-secondary">
                {pageLinks.map(({ href, id, label }) => (
                  <li key={id ?? "home"}>
                    <Link href={href} onClick={handlePageLinkClick(id)} className="transition-colors hover:text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-primary">{t("supportHeading")}</p>
              <ul className="mt-4 space-y-3 text-sm text-secondary">
                <li>
                  <Link href="/impressum" className="transition-colors hover:text-primary">
                    {t("impressum")}
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="transition-colors hover:text-primary">
                    {t("datenschutz")}
                  </Link>
                </li>
                <li>
                  <a
                    href={siteConfig.social.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    {t("openSource")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Empty spacer so the fixed scroll-driven background animation
            (star/plume, see components/Background.tsx) has room to reveal
            itself before the social/copyright row comes into view. Only
            needed on the homepage — the legal pages have a solid black
            backdrop and stay slim instead. */}
        {isHomePage && (
          <div aria-hidden="true" className="h-[34vh] min-h-[200px] sm:h-[46vh]" />
        )}

        {/* Social icons + copyright */}
        <div className={`flex flex-col gap-4 ${isHomePage ? "" : "-mt-10"}`}>
          <div className="flex items-center gap-5">
            {socialLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="inline-block text-secondary transition-all duration-300 hover:-translate-y-1 hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p className="text-sm text-secondary">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
