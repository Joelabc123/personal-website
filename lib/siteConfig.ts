const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!configuredSiteUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is required (for example: https://example.com).",
  );
}

const parsedSiteUrl = new URL(configuredSiteUrl);

if (!["http:", "https:"].includes(parsedSiteUrl.protocol)) {
  throw new Error("NEXT_PUBLIC_SITE_URL must use the http or https protocol.");
}

if (
  parsedSiteUrl.username ||
  parsedSiteUrl.password ||
  (parsedSiteUrl.pathname !== "/" && parsedSiteUrl.pathname !== "") ||
  parsedSiteUrl.search ||
  parsedSiteUrl.hash
) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be an origin without a path, query, or hash.",
  );
}

const siteUrl = parsedSiteUrl.origin;

export const siteConfig = {
  name: "Joel Bakirel",
  domain: parsedSiteUrl.hostname,
  url: siteUrl,
  email: "jb@joelbakirel.de",
  address: {
    street: "Auf der Vierzig 37",
    zipCity: "50859 Köln",
    country: "Deutschland",
  },
  social: {
    github: "https://github.com/Joelabc123",
    linkedin: "https://www.linkedin.com/in/joel-bakirel-93bb13292/",
  },
} as const;
