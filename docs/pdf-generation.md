# PDF Generation

Weave CV renders resumes to PDF server-side with headless Chromium via [Puppeteer](https://pptr.dev/).

## How It Works

1. The client serializes the resume as HTML and POSTs it to the `/api/pdf` route (`server/api/pdf.post.ts`).
2. The route authenticates the user (`requireAuth`), enforces a rate limit (**10 exports per 10 minutes per user**), and launches a headless browser.
3. The HTML is wrapped with the generated Tailwind CSS (`public/tailwind-pdf.css`) and the selected font's CSS.
4. The page is printed to a PDF at the requested paper size and streamed back with `Content-Disposition: attachment`.

Regenerate the PDF stylesheet after changing template CSS:

```bash
pnpm build:pdf-css
```

## Environment Switching

The route picks its browser stack automatically based on `VERCEL_ENV` (`server/api/pdf.post.ts:87-103`):

| Environment  | Package            | Notes                                          |
| ------------ | ------------------ | ---------------------------------------------- |
| Local dev    | `puppeteer`        | Downloads a matching Chromium during install   |
| Vercel       | `puppeteer-core` + `@sparticuz/chromium` | Ships a prebuilt Chromium for the Lambda runtime |

## Setup by Operating System

### Windows

Local development works out of the box. `puppeteer` downloads Chromium to the user cache on `pnpm install`.

Known gotchas:

- Long paths can break Chromium's install step — keep the project path short, or enable long paths in the Windows registry (`git config --global core.longpaths true` helps on git operations too).
- If Windows Defender or an antivirus quarantines the downloaded Chromium, reinstall with `pnpm rebuild puppeteer` and add an exclusion for the cache folder.

### macOS

Works out of the box. If you use a company-managed Mac, the first Chromium launch may be blocked by Gatekeeper quarantine on the downloaded binary:

```bash
xattr -cr "$HOME/Library/Caches/puppeteer"
```

### Linux (including CI)

Chromium needs system libraries that are not present on a minimal distro. On Debian/Ubuntu, install them before running the app or tests:

```bash
sudo apt-get update
sudo apt-get install -y \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libxkbcommon0
```

For Docker images, use the `puppeteer/browsers` base image or add the same packages to your `Dockerfile`.

In rootless environments (Docker/CI), add the `--no-sandbox` argument to `launchOptions.args` in `server/api/pdf.post.ts` and run with `--disable-setuid-sandbox`.

## Vercel / Serverless

- The route uses `@sparticuz/chromium` to resolve an executable path and `puppeteer-core` (which does not download a browser) to launch it.
- Chromium runs with `--no-sandbox` and `--disable-setuid-sandbox` (`server/api/pdf.post.ts:100`), which is required in the Lambda sandbox.
- Keep `@sparticuz/chromium`'s major version in sync with the Chromium version bundled for the runtime. Bumping it may change the set of system libs required.

## Troubleshooting

**`Failed to launch the browser process!` on Linux**
Missing shared libraries. Run `ldd` on the Chromium binary to see which ones are absent, then install them (see the Debian/Ubuntu list above).

**`Error: ... requires `--no-sandbox` / cannot be run as root`**
Chromium refuses to run as root without the sandbox. Add `--no-sandbox` to `launchOptions.args` for the affected environment.

**PDF is blank or styles are missing**
The route resolves `public/tailwind-pdf.css` from several locations, then falls back to fetching it over HTTP. If the stylesheet is stale, run `pnpm build:pdf-css`. In dev, ensure the public folder path is reachable from the running server.

**Timeout waiting for the page (`networkidle0`)**
Fonts are loaded before printing; if a custom font is slow to respond, `document.fonts.ready` can stall. Check the font URL in `buildFontCss` and confirm the font is reachable from the request's `host`.

**PDF generation is slow**
Each export spawns a full browser, so requests are rate-limited to 10 per 10 minutes per user (`server/api/pdf.post.ts:69`). Raise `server/utils/rateLimit.ts` limits only if your hosting plan can handle the CPU/memory.
