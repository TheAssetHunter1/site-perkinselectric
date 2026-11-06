# Perkins Electric website (demo)

Demo site for Perkins Electric, Kerrville TX. Astro static site hosted on Cloudflare Pages.

## Editing business details

Client-editable content (phone, email, hours, services, hero text and photo, hero boxes, reviews, announcement bar) is in **`src/data/content.json`**, edited through Pages CMS (see `.pages.yml`).
Fixed settings (name, domain, address, map, service area, rating) are in **`src/data/site.json`**.

## Cloudflare Pages settings

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |

## Going live checklist

1. Set `demo` to `false` in `site.json` (removes `noindex` and turns the real contact form on).
2. Set `url` to the real domain and update `public/robots.txt`.
3. Add `RESEND_API_KEY` and `CONTACT_TO` in Cloudflare (Settings → Variables and Secrets).
4. Replace the placeholder hero graphic in `src/assets/media/` with a real photo.

## Local development

```
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```
