"use client";

import { useLocale } from "next-intl";

type ModalRouteLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
};

export default function ModalRouteLink({
  children,
  className,
  href,
}: ModalRouteLinkProps) {
  const locale = useLocale();
  const localizedHref = `/${locale}${href === "/" ? "" : href}`;

  return (
    <a href={localizedHref} className={className}>
      {children}
    </a>
  );
}
