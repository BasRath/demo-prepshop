# demo-prepshop

**Prep Shop** is a tongue-in-cheek, anime-themed demo webshop for doomsday preppers.
It sells three totally essential products:

- **Dehydrated Water** – just add water!
- **Tinfoil Thinking Cap** – blocks mind rays and unsolicited opinions.
- **Canned Optimism** – open in case of apocalypse, Mondays or both.

It is a plain static site built with HTML, CSS and vanilla JavaScript – no build step,
no frameworks and no external dependencies. Nothing is actually for sale: the basket is
kept in your browser's `localStorage` and the checkout form data is never sent or stored.

## Features

- Product listing, product detail pages, basket and checkout.
- Basket with item count, remove, "Clear All Products" and "Proceed to Checkout".
- Checkout form (name + two address lines) that shows "Thank you for your order" and
  clears the basket on submit.
- Responsive layout (mobile first, CSS grid/flexbox).
- Accessibility: semantic HTML, skip link, labelled form fields, alt text, visible focus
  styles, live regions for status messages and reduced-motion support.
- Security: strict Content Security Policy (no inline scripts/styles, `form-action 'none'`),
  DOM updates via `textContent` only (no `innerHTML`), validated `localStorage` data and
  security headers on Vercel (`vercel.json`).

## Project structure

```
├── index.html                      # Main product listing page
├── basket.html                     # Shopping cart page
├── checkout.html                   # Checkout form page
├── product-*.html                  # Individual product pages
├── style.css                       # Main stylesheet
├── shop.js                         # JavaScript functionality
├── img/                            # Image assets
│   ├── prep-shop-logo.png
│   ├── basket-icon.png
│   └── product-*.png
├── vercel.json                     # Security headers for Vercel
└── README.md
```

## Run locally

Any static file server works. Serving over HTTP (rather than opening the files directly)
is recommended so `localStorage` behaves consistently. From the repository root:

```bash
# Python 3
python3 -m http.server 8000

# or Node.js
npx serve .
```

Then open <http://localhost:8000> (or the URL printed by `serve`).

## Deploy to Vercel (Hobby plan)

The site is fully static, so it runs on the free Vercel Hobby plan without configuration:

1. Import this repository in the [Vercel dashboard](https://vercel.com/new)
   (Framework preset: **Other**, no build command, output directory: the repository root).
2. Click **Deploy**.

Or with the Vercel CLI: `npx vercel` (preview) and `npx vercel --prod` (production).
The security headers in `vercel.json` are applied automatically.
