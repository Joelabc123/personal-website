# Personal website

Bilingual portfolio and CV built with Next.js, React, TypeScript, Tailwind CSS,
and `next-intl`.

## Development

```bash
npm install
npm run dev
```

The German homepage is available at
[http://localhost:3000/de](http://localhost:3000/de); `/en` serves the English
version. The `predev` hook prepares and validates the private travel gallery
before Next.js starts.

Run the complete local quality checks with:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The `prebuild` hook prepares the gallery automatically. If
`content/gallery` contains no trips, the generated manifest is empty and the
site displays its travel placeholder.

## Private gallery deployment

Travel originals are intentionally excluded from Git. Before a production
build or deployment:

1. Sync the privately backed-up folders into `content/gallery/<year>/<country>/<trip>`.
2. Keep one valid `_meta.json` and at least one supported image in every trip.
3. Run `npm run gallery:prepare` to validate and preview the generated output.
4. Run `npm run build`; the `prebuild` hook prepares the gallery again.

Generated WebP files under `public/generated/gallery` and
`lib/generated/gallery-manifest.json` are deployment artifacts, not source
files. A server or CI runner therefore needs the private photo sync before each
build. See `content/gallery/README.md` for the authoring contract.

## Container deployment

Pull requests and pushes to `main` run the quality checks in
`.github/workflows/docker-publish.yml`. A successful `main` run builds the
production image and publishes `latest` plus an immutable `sha-...` tag to
`ghcr.io/<owner>/<repository>`.

Set the GitHub Actions repository variable `NEXT_PUBLIC_SITE_URL` when the
canonical URL differs from `https://joelbakirel.de`. Add
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` as a repository secret so the public key is
available during the Next.js build. To deploy after the image was pushed, also
add the Coolify deploy webhook as `COOLIFY_WEBHOOK` and a Coolify API token with
the `deploy` permission as `COOLIFY_TOKEN`. If either secret is absent, the
workflow publishes the image and skips only the Coolify redeployment.

For Coolify, select `docker-compose.coolify.yml` as the Compose file and set the
runtime variables shown in `.env.example`. `APP_IMAGE` can override the default
GHCR image and `APP_HOST` controls the Traefik host rule. The Compose file keeps
port 3000 internal and routes HTTPS traffic through Coolify's Traefik proxy.
If the GHCR package is private, authenticate the Coolify server with a token
that has `read:packages` access before deploying.
