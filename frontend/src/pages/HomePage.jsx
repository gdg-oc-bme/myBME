import { useState } from 'react'
import { Link } from 'react-router'
import heroImage from '../assets/campus-k-building-dusk.webp'
import { useAuth } from '../auth/auth.js'
import PlaceList from '../components/PlaceList.jsx'
import { guides } from '../data/guides.js'
import { quickLinks } from '../data/links.js'
import { categories, places } from '../data/places.js'

const suggestions = ['Printing', 'Library', 'ETK', 'Building Q']

const buildings = [...new Set(places.map((p) => p.building))].map((id) => ({
  id,
  label: id === 'Library' ? 'Lib' : id,
  name: id === 'Library' ? 'Central Library' : `${id} building`,
  count: places.filter((p) => p.building === id).length,
}))

const matches = (query, ...fields) => {
  const q = query.trim().toLowerCase()
  return !q || fields.some((f) => f?.toLowerCase().includes(q))
}

function Panel({ title, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl bg-white ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 pb-3">
        <h2 className="font-display text-xl font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const [now] = useState(() => new Date())
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [building, setBuilding] = useState(null)

  const visibleLinks = quickLinks.filter((l) => matches(query, l.title, l.description))
  const visiblePlaces = places.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (!building || p.building === building) &&
      matches(query, p.name, p.description, p.location, `building ${p.building}`),
  )

  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-sm font-medium text-ink-soft">
            <span className="mr-2 inline-block size-2 rounded-full bg-bme-red align-middle" aria-hidden="true" />
            {today}
          </p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-extrabold leading-[0.95] tracking-tight">
            What do you need on campus <span className="text-bme-red">today?</span>
          </h1>

          <div className="mt-8">
            <label htmlFor="search" className="sr-only">
              Search services and places
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search printing, offices, buildings…"
              className="w-full rounded-full border border-line bg-white px-6 py-4 text-lg placeholder:text-ink-soft/60 focus:border-bme-red focus:outline-none focus:ring-4 focus:ring-bme-red/15"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink-soft">Try:</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-line bg-white px-3 py-1 hover:border-bme-red hover:text-bme-red"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <figure className="relative">
          <img
            src={heroImage}
            alt="The K building of BME on the Danube bank at dusk"
            className="aspect-[4/3] w-full rounded-3xl object-cover object-[55%_40%]"
          />
          <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">
            K building · Műegyetem rakpart 3
          </figcaption>
        </figure>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-xl font-bold">Browse by building</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {buildings.map((b) => {
            const selected = building === b.id
            return (
              <button
                key={b.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setBuilding(selected ? null : b.id)}
                className={`min-w-28 shrink-0 rounded-2xl px-5 py-4 text-left transition-colors ${
                  selected ? 'bg-bme-red text-white' : 'bg-white hover:bg-bme-red-50'
                }`}
              >
                <span className={`block font-display text-4xl font-extrabold ${selected ? '' : 'text-bme-red'}`}>
                  {b.label}
                </span>
                <span className={`mt-1 block text-xs ${selected ? 'text-white/80' : 'text-ink-soft'}`}>
                  {b.count} {b.count === 1 ? 'place' : 'places'}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Panel
          title={building ? buildings.find((b) => b.id === building).name : 'Places on campus'}
          action={
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5 text-sm">
              {[{ id: 'all', label: 'All' }, ...categories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className={`rounded-full px-3 py-1 ${
                    category === c.id ? 'bg-ink text-white' : 'bg-cream text-ink-soft hover:text-ink'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          }
        >
          <PlaceList places={visiblePlaces} />
        </Panel>

        <div className="space-y-6">
          <Panel title="Quick links">
            {visibleLinks.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-ink-soft">No links match.</p>
            ) : (
              <ul className="divide-y divide-line pb-2">
                {visibleLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between gap-3 px-5 py-3"
                    >
                      <span>
                        <span className="block font-semibold group-hover:text-bme-red">{link.title}</span>
                        <span className="block text-xs text-ink-soft">{link.description}</span>
                      </span>
                      <span aria-hidden="true" className="text-ink-soft group-hover:text-bme-red">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {!user && (
            <section className="rounded-2xl bg-bme-red p-6 text-white">
              <h2 className="font-display text-2xl font-bold leading-tight">Your classes, in the same place.</h2>
              <p className="mt-2 text-sm text-white/85">Sign in with your BME eduID to see your day.</p>
              <Link
                to="/login"
                className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-bme-red hover:bg-cream"
              >
                Sign in
              </Link>
            </section>
          )}
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">New to BME? Start here.</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide, i) => (
            <li key={guide.id}>
              <a href={guide.url} target="_blank" rel="noreferrer" className="group block">
                <span className="font-display text-5xl font-extrabold text-bme-red/25 group-hover:text-bme-red">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-2 block font-semibold group-hover:underline underline-offset-4">
                  {guide.title}
                </span>
                <span className="mt-1 block text-sm text-ink-soft">{guide.description}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
