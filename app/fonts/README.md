# Porsche Next

Place the licensed regular font at `app/fonts/PorscheNext-Regular.woff2`.
Then activate it in `app/[locale]/layout.tsx` with Next.js' local font loader:

```tsx
import localFont from "next/font/local";

const porscheNext = localFont({
  src: "../fonts/PorscheNext-Regular.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Arial Narrow", "Arial"],
  variable: "--font-porsche-next",
});
```

Add `porscheNext.variable` to the `<html>` class. Until the licensed WOFF2 is
available, `--p-font-family` in `app/globals.css` uses the required Arial
Narrow fallback. Do not add an unlicensed font file to this directory.
