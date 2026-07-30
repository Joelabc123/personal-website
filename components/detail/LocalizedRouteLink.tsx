"use client";

import { useLocale } from "next-intl";

type LocalizedRouteLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
};

export default function LocalizedRouteLink({
  children,
  className,
  href,
}: LocalizedRouteLinkProps) {
  const locale = useLocale();
  const localizedHref = `/${locale}${href === "/" ? "" : href}`;

  return (
    <a href={localizedHref} className={className}>
      {children}
    </a>
  );
}
