# Perkins Electric: site notes

Demo/mockup website for Perkins Electric (owner Troy Perkins), a Kerrville TX electrician. Built by Mike (Advanced Computer Repair) as a sales mockup. Mike has used them himself and was very happy with the work. Not yet a client.
Read this before changing anything. Update the change log at the bottom with every change.

## Where things live

| Thing | Where |
|---|---|
| Live domain | none (they have no website; demo at site-perkinselectric.pages.dev) |
| Code | GitHub `TheAssetHunter1/site-perkinselectric`, branch **`main`** |
| Hosting | Cloudflare Pages project **`site-perkinselectric`** (Mike's account info@advancomputer.com) |
| Template | Copied from `site-moseleyelectric` (itself from `site-advancomputer`) |

## Business details

Business info is split in two files, merged by `src/data/index.ts`:
- **`src/data/content.json`**: client-editable (Pages CMS, defined by **`.pages.yml`**; keep them in sync).
- **`src/data/site.json`**: fixed settings. `demo: true` adds `noindex` and makes the contact form show a demo message instead of sending.

Taken from the public Google listings (Nov 2026). **There are two Google listings for the same phone number:**
1. 2640 Junction Hwy Ste B, Kerrville 78028. 5.0 from 3 reviews. No website, no hours. Appears claimed. The site uses this address.
2. 105 Contour Dr, Kerrville 78028. 4.3 from 6 reviews. **Unclaimed**, and its "Website" button goes to a spam directory (usmaplyn.org / usmapinformation.com).
- BBB lists them in Ingram, TX 78025, not accredited, with a service area of Bandera, Comfort, Hunt, Ingram, Kerrville, Harper and nearby ZIPs.
- Crew named in reviews: Troy (owner), Roger, Jesus.
- Services come from reviews and the Google services list: new-home wiring, HVAC breaker, EV charger, hot tub electrical, switch relocation, outlet & switch install, Ethernet/conduit pull.
- Reviews are real Google reviews quoted word for word (shortened at sentence ends where Google truncates).
- Includes Mike's own Google review (Nov 2026, remodel job, permits pulled with the City); spelling of "recommend" corrected and a period added.
- No star rating number is shown on the site, because the two listings split the reviews.

## To confirm with Troy before going live

- Texas TDLR license number, and whether "Licensed" / insured can be stated.
- Hours (neither Google listing has any).
- Whether to show the Junction Hwy shop address; which listing is correct (105 Contour Dr may be a home address).
- Email address for the site and contact form.
- Real photos (truck, crew, jobs) to replace the placeholder hero graphic; logo (round black/white "Perkins Electric" badge exists on namesandnumbers.com).
- OK to quote Google reviews; final services list and service area; years in business (Google says 5+ / 7+).

## Sales notes

- Fixing the duplicate Google listing (merge/remove the unclaimed one and its spam website link) is a concrete win to offer alongside the site.

## Rules

- Do not claim anything not confirmed (license, insurance, years in business, emergency/24-hour service).
- Colors: charcoal `hsl(215 19% 17%)` primary, red accent (`bg-accent-glow`). Wordmark is text + Lucide `zap` icon (no logo yet).
- Make each change its own commit with a clear message.

## Commands

```
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

## Change log

- 2026-11-06: Demo built from the Moseley Electric mockup. Charcoal/red theme, Perkins services and Google reviews, shop address on contact card, no rating count, unconfirmed "licensed" wording removed, noindex.
- 2026-11-06: Added Mike's Google review (remodel, permits); reviews now a 2x2 grid.
