# Travel gallery

Store and commit originals in this structure:

```text
content/gallery/
└── 2026/
    └── japan/
        └── tokyo-spring/
            ├── _meta.json
            ├── 01-cover.jpg
            └── 02-shibuya.avif
```

Year and folder slugs are part of the public URL. Use a four-digit year and
lowercase ASCII slugs (`a-z`, `0-9`, `-`). If a place occurs more than once in
one year, use a unique trip slug such as `new-york-spring`.

Supported originals are JPEG, PNG, WebP, and AVIF. HEIC/HEIF must be converted
beforehand, for example to JPEG or AVIF. Every trip needs `_meta.json` and at
least one image. Copy `_meta.example.json` as a starting point.

`npm run gallery:prepare` validates the tree, auto-rotates images, removes
metadata, limits the long edge to 2400 px without upscaling, and writes hashed
WebP derivatives plus a manifest. Originals and `_meta.json` files are
versioned in Git; generated derivatives and the manifest stay ignored.

Default ordering is newest year first, then newest trip date, then place name.
Images use their numeric prefix and filename. The first image is the default
cover. Trips with seven or more images collapse to a single place card; set
`collapsed` to override that behavior.
