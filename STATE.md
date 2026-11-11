# State — myBME

_2026-11-11, branch `danny/consolidate-user-identity` (based on `main`, not yet merged). Three other PRs open: #9 `danny/backend-building-w2` (dev-config security fixes, since 11-03), #15 `danny/accounts-saml` (SAML login, since 11-03), #16 `efe/auth-and-redesign` (frontend redesign + real API wiring, since 11-03). Issues #10–14 closed; #3 (dev seed) open, assigned to Zhur — its criteria need rewriting, see below._

## What it is
A platform tying various services together for BME (Budapest University of Technology) students into one place. GDG On Campus BME project (org `gdg-oc-bme`). Monorepo: `backend/` (Django), `frontend/` (placeholder), `compose.yml` (Postgres).

## Status
| Component | Status | Evidence |
|---|---|---|
| Backend scaffold | done, on `main` | `backend/manage.py`, `backend/backend/settings.py`, DRF + CORS configured |
| `/api/health/` endpoint | done, on `main` | returns `{"status":"ok"}` |
| DB schema | **Alembic/SQLAlchemy removed** (this branch) | was dead weight — never wired into the Django app (not even a runtime dependency), schema never consumed, no data in it. Single schema authority is now `manage.py migrate` only |
| User identity | **consolidated** (this branch) | one identity: Django's `auth_user` (SAML-provisioned on PR #15). Domain data lives on a new `profiles.Profile` (`OneToOneField(User)`), auto-created by a `post_save` signal so every `User` always has exactly one `Profile` — no bridging, no "missing mapping" case possible |
| SAML SP login (Moodle SSO) | done in **PR #15** (open), verified against real IdP (not full round-trip) | see "SAML login" below |
| `/accounts/me/`, `/api/dashboard/` | done in **PR #15** (open) | returns correct data for a force-logged-in test user |
| Dev config/security fixes (SECRET_KEY, compose password, manage.py shebang) | done, own PR | **PR #9**, open since 11-03, not yet merged |
| Frontend prototype | merged (`main`), static demo data only | Vite + React + Tailwind, `frontend/src/data/*.js` |
| Frontend redesign + real API client | done in **PR #16** (open) | `frontend/src/api/client.js` (cookie-based `apiGet`), `AuthProvider` now calls `/accounts/me/` with a dev-only demo-mode fallback |
| Tests | basic coverage for the 3 real endpoints (in PR #15) | `api/tests.py`, `accounts/tests.py` — `manage.py test` passes, no env overrides needed |
| CI | missing | no `.github/workflows` — tests exist but nothing runs them automatically |
| Dev seed data | not started, criteria now stale | issue **#3**, open, assigned to Zhur — written against the removed Alembic schema, needs rewriting against `profiles.Profile` before they pick it up |
| `links`/`categories`/`favorites` | **not recreated** | the Alembic migration defined these but nothing ever consumed them; rebuilding them as Django models is deferred until an actual feature needs them (Alembic's schema is still in git history at `backend/alembic/versions/cdfeb5263f28_init_tables.py` as of commit `b261f19` for reference) |

**Workable product:** not yet — `main` alone has only the health endpoint, DB schema, and static frontend; the login, dashboard, and real API wiring all live in unmerged PRs (#9, #15, #16). This branch (`danny/consolidate-user-identity`) fixes the identity model underneath all three but isn't merged yet either.

## How to run
- DB: `docker compose up -d` (brings up `db` service, port 5432; credentials from `.env`)
- Backend: create a venv (`python3 -m venv backend/.venv`), `pip install -r backend/requirements.txt`, populate `.env` per `.env.example`, then `backend/manage.py migrate` and `runserver`.
- **System dependency for SAML:** production/normal dev needs the `xmlsec1` CLI (`apt install xmlsec1`) — pysaml2's supported crypto backend. Only override `SAML_CRYPTO_BACKEND=XMLSecurity` (pure-Python, untested by pysaml2, no encrypted-assertion support) in a sandbox with no `apt`/`sudo` access.
- Frontend: not scaffolded yet.

## SAML login (Moodle SSO via BME eduID)
Confirmed 2026-11-03 (Danny): BME eduID is SAML. Moodle federates with it. Neptun has its own separate, non-federated login — shallow link only, no SSO attempted.

- `backend/accounts/saml_config.py` — SP config for `djangosaml2`/`pysaml2`. IdP metadata cached at `backend/accounts/metadata/bme_idp.xml`, fetched live from `https://login.bme.hu/idp/shibboleth` (real Shibboleth IdP — confirmed reachable, entityID `https://login.bme.hu/idp/shibboleth`, SSO at `.../idp/profile/SAML2/{POST,Redirect}/SSO`). Re-fetch if BME rotates their signing cert.
- SP keypair (`backend/accounts/certs/sp.{key,crt}`) generated locally via `openssl`, gitignored — **never commit**, each environment should generate its own.
- `AUTHENTICATION_BACKENDS` includes `djangosaml2.backends.Saml2Backend`; `SAML_CREATE_UNKNOWN_USER=True` auto-provisions a Django user from the assertion via `SAML_ATTRIBUTE_MAPPING` (`eduPersonPrincipalName`→username, `mail`→email, `givenName`/`sn`→name). **Unverified against reality**: the actual attributes BME's IdP releases to us depend on registering this SP with BME's identity team — not done yet.
- `MIDDLEWARE` needed `djangosaml2.middleware.SamlSessionMiddleware` added right after `SessionMiddleware` (djangosaml2 1.12 requires `request.saml_session`; omitting it 500s on `/saml2/login/`).
- Verified live: `GET /saml2/login/` returns a correctly-formed, unsigned `AuthnRequest` POSTing to BME's real `https://login.bme.hu/idp/profile/SAML2/POST/SSO`, `Destination`/`Issuer`/ACS URL all correct (decoded and inspected). `GET /saml2/metadata/` serves our SP's own metadata (this is the file to hand BME's IT/identity team to register the SP). Full round-trip (actually completing a login) **not verified** — needs real BME credentials and, almost certainly, our SP being registered with BME's federation first.

## Dashboard / linked services
- `GET /api/dashboard/` (auth required) returns a **static** list — `{"name": "Moodle", "sso": true}`, `{"name": "Neptun", "sso": false}` — URLs read from `MOODLE_URL`/`NEPTUN_URL` env vars, currently empty (never guessed/hardcoded; fill in the real URLs in `.env`).
- Deliberately no `LinkedService` DB model yet — two known entries doesn't justify a table. Revisit if the list grows or needs admin editing.
- `GET /accounts/me/` returns the logged-in user's basic fields.

## Decisions and why
- Django + DRF + Postgres for backend; config via `.env` + `python-dotenv`.
- `djangosaml2`/`pysaml2` for the SAML SP — don't hand-roll SAML/XML-signature handling.
- No credential vault, ever, for any linked site — security/ToS liability. Neptun gets a link, not an integration.
- No DB model for linked services yet (see above).
- **One ORM, one migration tool.** The Alembic/SQLAlchemy track added in PR #8 was a prior Claude session's generic suggestion, never actually wired into the Django app (not a runtime dependency, zero code referenced it), and had zero data in it. Removed rather than bridged — Django's `auth_user` + a `profiles.Profile` model covers the same ground with no second schema-management system to keep in sync.

## Known issues
- **PR #9, #15, #16, and this branch** all still open/unmerged since 11-03/11-11. PR #9 and #15 both touch `backend/backend/settings.py`, and this branch also touches it (`INSTALLED_APPS`) — merge order matters: #9, then this branch, then rebase+merge #15, then #16.
- Issue **#3** (dev seed) needs its criteria rewritten against `profiles.Profile` before Zhur starts it — the old criteria (`alembic upgrade head`, `SELECT * FROM users`) no longer apply.
- **SAML crypto backend**: PR #15's testing used `SAML_CRYPTO_BACKEND=XMLSecurity` because the sandbox had no passwordless `sudo` to `apt install xmlsec1`. The code defaults to the standard `xmlsec1` backend; **run `sudo apt-get install -y xmlsec1` on the real dev/deploy machine** and don't ship with the override.
- Actual SAML attribute release and SP federation registration with BME's identity team: unknown/undone — login can't be fully tested until that happens.

## Next steps
1. Merge this branch (`danny/consolidate-user-identity`), then PR #9, then rebase+merge #15, then #16 — in that order (settings.py touches each other).
2. Rewrite issue #3's seed script as a `manage.py` management command against `profiles.Profile` (not Alembic) — coordinate with Zhur before they start.
3. Register myBME's SP metadata (`/saml2/metadata/`) with BME's identity/IT team to join the federation — needed before any real login attempt will work.
4. Fill in real `MOODLE_URL`/`NEPTUN_URL` in `.env` once known.
5. Add a basic CI workflow (`.github/workflows`) to run `manage.py test` (and frontend lint/build) on push/PR.
6. Once attribute release is confirmed by BME, correct `SAML_ATTRIBUTE_MAPPING` if the real attribute names differ from the eduPerson-schema guess used now.
7. When a links/favorites feature is actually built, model `Link`/`Category`/`Favorite` as Django models from the start (favorites FK'd to `auth_user`, not a parallel user table) — see the removed Alembic schema in git history for field-level prior art.

## Open questions
- What are the actual "various services" beyond Moodle/Neptun this platform should tie together (course-specific pages — likely also shallow links, same as Neptun, unless one turns out to be SAML-federated)?
- What's BME's actual process/contact for registering a new SAML SP with their federation?

## Vision (from the design doc — keep in view)
**End goal:** Build a platform that ties together various services BME students regularly use, such as the various Moodle sites, Neptun, potentially course-specific pages, and offers an easy login point for students to access all they need. Convenience is the main pillar of this project.

**Scope & non-goals:** The platform will:
- Allow users to log in via eduID / BME login, and automatically log in to linked sites.
- Have a clean UI/UX design that is easy to follow.
- Provide best-effort answers without replacing official university channels.
