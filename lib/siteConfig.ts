export const siteConfig = {
  name: "Joel Bakirel",
  domain: "joelbakirel.de",
  url: "https://joelbakirel.de",
  email: "jb@joelbakirel.de",
  address: {
    street: "Auf der Vierzig 37",
    zipCity: "50859 Köln",
    country: "Deutschland",
  },
  social: {
    github: "https://github.com/Joelabc123",
    linkedin: "https://www.linkedin.com/in/joel-bakirel-93bb13292/",
    repo: "https://github.com/Joelabc123/personal-website",
  },
  nav: [
    { id: "werdegang", labelKey: "journey" },
    { id: "kontakt", labelKey: "contact" },
  ],
} as const;
