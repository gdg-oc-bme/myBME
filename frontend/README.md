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

The backend URL defaults to `http://localhost:8000`. To change it, copy `.env.example`
to `.env.local` and set `VITE_BACKEND_URL`.

## Backend connection

- **Sign in / sign out** are plain links to `{BACKEND_URL}/saml2/login/` and `/saml2/logout/`
  (SAML needs a full-page redirect, not `fetch()`). After login the backend sends the
  browser back to `/dashboard`.
- **Login state** comes from `GET /accounts/me/` on app load: 200 = signed in,
  401/403 = signed out. Nothing is stored in the browser.
- **All API calls** go through `apiGet()` in `src/api/client.js`, which sends the session
  cookie (`credentials: 'include'`). Use it for every new endpoint.
- If the backend isn't running, the sign-in page says so and (in `npm run dev` only)
  offers a demo account so the dashboard can still be shown.

## Structure

```
src/
  pages/        HomePage (public), LoginPage, DashboardPage (signed-in students)
  api/          Backend URL + apiGet() helper
  auth/         Login state from GET /accounts/me/
  components/   Shared UI (Header, Footer, PlaceList, StatusBadge)
  data/         Hard-coded content (links, places, guides, sample timetable)
  assets/       Campus photos
  utils/        Helpers (open/closed calculation)
  index.css     Tailwind import + BME brand tokens
```

## Content

Most content still lives in `src/data/` and will move to the backend as endpoints appear.

- `links.js` – official BME services only.
- `guides.js` – "New to BME?" steps, each linking to an official page.
- `sampleTimetable.js` – placeholder classes and courses (labelled "sample" on the page).
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
| `paper`         | `#F1F1F1` | Light background          |

Headings use **Noto Serif**, body text uses **Noto Sans**.

Photos are by Dennis G. Jarvis, licensed
[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/), via Wikimedia Commons
(resized). The credit in the footer must stay as long as they are used.
