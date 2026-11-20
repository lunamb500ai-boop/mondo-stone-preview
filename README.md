# Mondo Stone website

Static website for Mondo Stone, a stonemasonry business in Albert Park, Melbourne. Plain HTML, CSS and JavaScript. There is no build step and no framework: open `index.html` in a browser, or upload the folder to any static host.

## Structure

| Path | What it is |
|---|---|
| `index.html` | Home: hero, intro, services, selected work, process, stone supply, enquiry call-out |
| `services.html` | Each service in detail |
| `work.html` | Photo gallery with filters (Kitchens, Bathrooms, Walls & floors, Vanities) and a lightbox |
| `stone.html` | Materials we work with |
| `about.html` | About the business and service area |
| `contact.html` | Phone, email and the enquiry form |
| `404.html` | Not-found page (point your host's 404 setting at it) |
| `css/site.css` | The one shared stylesheet |
| `js/site.js` | The one shared script: mobile menu, gallery filters, lightbox, form checks |
| `images/` | Edited job photos (`name.jpg` up to 1600 px, `name-800.jpg`, plus `.webp` of each) and `og-image.jpg` |
| `images/CREDITS.md` | Which original photo each image came from and the edits made |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | Site basics |
| `_src-photos/` | Original photos. Git-ignored. Do not upload. |

## How to edit

- **Text**: open the page's `.html` file and change the words. The header and footer are repeated in every page, so a change there (phone, email, navigation) must be made in all seven files. A find-and-replace across the folder does it.
- **Colours and type**: the variables at the top of `css/site.css`. The design is black, white and greys only; the photos supply the colour. Fonts are Inter Tight (uppercase headings), Figtree (text) and Instrument Serif italic (accents) from Google Fonts, with system fallbacks if offline.
- **Add a photo to the gallery**: export `name.jpg` (max 1600 px long edge), `name-800.jpg` and matching `.webp` files into `images/`, then copy one `<figure class="card">` block in `work.html` and change the file names, `width`/`height`, `alt`, caption and `data-cats` (any of `kitchens bathrooms walls vanities`). Update the "Showing 24 photos" count.
- **Captions** describe what is visible in the photo (material appearance and job type). Please correct any stone names we have guessed wrongly, and add suburbs only where you are happy to publish them.

## TODOs before going live

Each is marked with a `TODO` comment in the code.

1. **Email**: `hello@mondostone.com.au` is a placeholder (`<!-- TODO confirm email -->`). It appears in every footer, on `contact.html`, and in the form's `data-mailto`.
2. **Form endpoint**: the enquiry form's `action="#"` is a placeholder. Until it is replaced, the script opens the visitor's own email app with the details filled in, which needs no service. To have enquiries delivered directly, set `action` to your host's form handler URL; the script then submits the form normally.
3. **Domain**: `https://mondostone.com.au` is assumed in canonical and Open Graph tags, the JSON-LD on the home page, `robots.txt` and `sitemap.xml`. Find-and-replace if the domain differs.
4. **Logo**: the header uses a text wordmark and `favicon.svg` is a simple "M" monogram. Swap in the real logo when there is one.
5. **Acknowledgement of Country**: the footer names the Bunurong people of the Kulin Nation for Albert Park. Please confirm you are happy with the wording.
6. **Stone names in captions**: confirm the materials (for example which pieces are marble, terrazzo or porcelain).

## Brand and content rules

- The brand is **Mondo Stone** only. The legal entity appears once, in small print in the footer: "Mondo Stone is a trading name of Mondo Stone & Glass Works Pty Ltd · ABN 23 606 816 693". Do not use the old name, old domains or old landline elsewhere.
- No reviews, star ratings or review-site links. No invented claims (years in business, awards, licence numbers, client names).
- Positioning: a stonemasonry service (measure, template, fabricate, install) that can also supply the stone. Not a showroom.

## Engineered stone note

Engineered stone benchtops, panels and slabs have been banned in Australia since 1 July 2024. This site therefore lists only natural stone (marble, quartzite, granite, onyx, travertine), cement-based terrazzo and porcelain or sintered slabs. Do not add engineered stone products or brand names for them to any page. The check used before handover:

```
grep -rniE 'caesarstone|engineered|quartz([^i]|$)' --include='*.html' --include='*.css' --include='*.js' .
```

It should return nothing. ("Quartzite" is a natural stone and is allowed.)

## Preview locally

```
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` directly from the folder also works.
