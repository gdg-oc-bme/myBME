# myBME – Frontend

React + Tailwind CSS, built with [Vite](https://vite.dev/).

## Getting started

Requires Node.js 20+.

```bash
cd frontend
npm install
npm run dev      # local dev server at http://localhost:5173
npm run build    # production build into dist/
npm run lint     # oxlint
```

## Structure

```
src/
  pages/        HomePage (public), LoginPage, DashboardPage (signed-in students)
  auth/         Demo login state (to be replaced by BME eduID via the backend)
  components/   Shared UI (Header, Footer, QuickLinks, PlaceList, ...)
  data/         Content shown on the site (links, places, demo student)
  utils/        Helpers (open/closed calculation)
  index.css     Tailwind import + BME brand tokens
```

## Content

All content currently lives in `src/data/`. This will be replaced by the backend API later.

- `links.js` – official BME services only.
- `places.js` – campus places. Entries with `verified: true` have been checked against the
  official source in `source`. Entries with `verified: false` are **sample data** used for
  layout and are labelled as such on the page.

## Branding

Colours and fonts follow the official bme.hu site:

| Token           | Value     | Use                       |
| --------------- | --------- | ------------------------- |
| `bme-red`       | `#931634` | Primary brand colour      |
| `bme-red-dark`  | `#76122A` | Hover / pressed           |
| `ink`           | `#262626` | Body text                 |
| `line`          | `#E6E9EB` | Borders                   |
| `paper`         | `#F1F1F1` | Page background           |

Headings use **Noto Serif**, body text uses **Noto Sans**.
