"use client";

import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type AnchorLinkProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

// In-page navigation that smooth-scrolls to a section without ever
// writing the target id into the URL as a `#hash` (unlike a native
// anchor click, which always updates the address bar).
export default function AnchorLink({ targetId, className, children }: AnchorLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Link href="/" onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
