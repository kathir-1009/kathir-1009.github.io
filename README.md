# Kathiravan K — Portfolio

A single-page developer portfolio built with plain HTML, CSS and JavaScript.
No frameworks, no build step, no dependencies.

## Live preview

Open `index.html` directly in a browser, or serve it locally:

```bash
npx serve .
# or
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Structure

```
kathirportfolio/
├── index.html                      # Everything, one page
├── robots.txt                      # Search-engine crawl rules
├── sitemap.xml                     # SEO sitemap
└── assets/
    ├── css/styles.css              # All styling + dark/light themes
    ├── js/main.js                  # Theme, nav, scroll-spy, form, counters
    ├── img/favicon.svg             # Monogram "K" favicon
    └── resume/KathiravanKResume.pdf
```

## Features

| Feature | Notes |
|---|---|
| Dark / light theme | Toggle in the header; saved to `localStorage`, defaults to the OS setting |
| Responsive nav | Slide-down drawer below 880px with a scrim, Esc to close |
| Scroll spy | The active section is highlighted in the nav |
| Reveal animations | `IntersectionObserver`, disabled under `prefers-reduced-motion` |
| Animated counters | Hero stats count up on first view |
| Contact form | Composes an email via `mailto:` — no backend, no data leaves the device |
| Copy email | One-click copy with a visual confirmation |
| Resume download | Direct link to the PDF |
| SEO | Meta description, keywords, canonical, Open Graph, Twitter card, sitemap |
| Accessibility | Skip link, ARIA labels, visible focus rings, semantic landmarks |
| Print stylesheet | Hides chrome and prints a clean CV |

## Before you publish — check these

The social links are already pointing at your real profiles:

- GitHub — <https://github.com/kathir-1009>
- LinkedIn — <https://www.linkedin.com/in/kathiravan1005>

Two things still need your decision:

1. **The site URL.** The canonical URL, `og:url`, `robots.txt` and `sitemap.xml` are all
   set to `https://kathir-1009.github.io/`. That is correct **if** you publish this as a
   user site. If you push it to a differently-named repo (say `kathirportfolio`), your
   live address becomes `https://kathir-1009.github.io/kathirportfolio/` — update all four
   places to match:

   ```powershell
   # Windows PowerShell — run from the project folder
   $old = 'kathir-1009.github.io'
   $new = 'kathir-1009.github.io/kathirportfolio'
   foreach ($f in 'index.html', 'robots.txt', 'sitemap.xml') {
     (Get-Content $f -Raw) -replace [regex]::Escape($old), $new | Set-Content $f -NoNewline
   }
   ```

2. **Contact details.** The email `kkathiravanmrk@gmail.com` and phone `+91 81482 60510`
   appear in `index.html`. The email is also the `EMAIL` constant near the bottom of
   `assets/js/main.js` — change it there too if you switch to another address, or the
   contact form will still send to the old one.

## Deploying

**GitHub Pages (free)**

For the cleanest URL, create a repo named `kathir-1009.github.io` and push this folder to it.
That publishes at `https://kathir-1009.github.io/` with no sub-path.

```bash
git init
git add .
git commit -m "Initial commit — portfolio"
git branch -M main
git remote add origin https://github.com/kathir-1009/kathir-1009.github.io.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
It goes live in about a minute at `https://kathir-1009.github.io/`.

**Netlify / Vercel / Cloudflare Pages**

Drag the folder onto the deploy dashboard, or connect the repo. No build command needed.

## Customising the look

Everything visual lives in the `:root` block at the top of `assets/css/styles.css`.

Change the accent colour by editing the accent ramp:

```css
--a-400: 56 189 248;   /* primary accent  */
--a-500: 59 130 246;   /* secondary       */
--a-600: 99 102 241;   /* tertiary        */
```

Values are space-separated `R G B` so they can be used with `rgb(var(--accent) / 0.2)`
style alpha. Try emerald (`16 185 129`), violet (`139 92 246`), or rose (`244 63 94`).

To change the fonts, edit the Google Fonts `<link>` in `index.html`, then update the
`font-family` on `body` and the two `"JetBrains Mono"` references (`.section__kicker`,
`.tl-date`, `.project__year`) in `styles.css`.

## Adding a new section

1. Add a `<section id="…" class="section">` block in `index.html`, before the footer.
2. Add a matching `<li><a class="nav__link" href="#…">` to the nav — the scroll spy
   picks it up automatically.
3. Add `class="reveal"` to the block to animate it in on scroll.

## Browser support

Modern evergreen browsers — Chrome, Edge, Firefox, Safari. Uses `IntersectionObserver`,
CSS custom properties, `backdrop-filter`, `100dvh` and `IntersectionObserver`-based
theming, all with sensible fallbacks.

## Licence

Personal portfolio. Add your preferred licence if you plan to reuse the code.
