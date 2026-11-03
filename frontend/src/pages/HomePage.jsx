import { useState } from 'react'
import { Link } from 'react-router'
import heroImage from '../assets/campus-k-building-dusk.webp'
import { useAuth } from '../auth/auth.js'
import PlaceList from '../components/PlaceList.jsx'
import { guides } from '../data/guides.js'
import { quickLinks } from '../data/links.js'
import { categories, places } from '../data/places.js'

const matches = (query, ...fields) => {
  const q = query.trim().toLowerCase()
  return !q || fields.some((f) => f?.toLowerCase().includes(q))
}

function SectionTitle({ children }) {
  return <h2 className="font-serif text-2xl font-bold mb-4">{children}</h2>
}

export default function HomePage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const visibleLinks = quickLinks.filter((l) => matches(query, l.title, l.description))
  const visiblePlaces = places.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      matches(query, p.name, p.description, p.location, `building ${p.building}`),
  )

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <img
          src={heroImage}
          alt="The K building of BME on the Danube bank at dusk"
          className="absolute inset-0 -z-10 size-full object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/10" />
        <div className="mx-auto max-w-6xl px-4 pt-24 pb-14 sm:pt-32 sm:pb-20">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/70">For every BME student</p>
          <h1 className="mt-3 max-w-xl font-serif text-4xl sm:text-5xl font-bold leading-[1.1] text-white">
            Your campus, in one place.
          </h1>
          <p className="mt-4 max-w-lg text-white/80">
            Offices, printing, the library and study spaces – where they are and when they’re open.
          </p>
          <div className="mt-8 max-w-lg">
            <label htmlFor="search" className="sr-only">
              Search services and places
            </label>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: printing, library, building Q…"
              className="w-full bg-white px-4 py-3.5 text-ink placeholder:text-ink-soft/70 shadow-lg focus:outline-none focus:ring-4 focus:ring-bme-red/40"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <section className="mt-14">
          <SectionTitle>Essential services</SectionTitle>
          {visibleLinks.length === 0 ? (
            <p className="text-ink-soft">No services match your search.</p>
          ) : (
            <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleLinks.map((link) => (
                <li key={link.id} className="border-t-2 border-ink pt-3">
                  <a href={link.url} target="_blank" rel="noreferrer" className="group block">
                    <span className="font-semibold group-hover:text-bme-red group-hover:underline underline-offset-4">
                      {link.title} <span aria-hidden="true">↗</span>
                    </span>
                    <span className="mt-1 block text-sm text-ink-soft">{link.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_20rem]">
          <section>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-4">
              <h2 className="font-serif text-2xl font-bold">Places on campus</h2>
              <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {[{ id: 'all', label: 'All' }, ...categories].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={category === c.id}
                    onClick={() => setCategory(c.id)}
                    className={`py-1 border-b-2 ${
                      category === c.id
                        ? 'border-bme-red text-ink font-semibold'
                        : 'border-transparent text-ink-soft hover:text-ink'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <PlaceList places={visiblePlaces} />
          </section>

          <aside className="space-y-8">
            <section>
              <SectionTitle>New to BME?</SectionTitle>
              <ol className="border-t border-ink">
                {guides.map((guide, i) => (
                  <li key={guide.id} className="border-b border-line py-4">
                    <a href={guide.url} target="_blank" rel="noreferrer" className="group flex gap-3">
                      <span className="font-serif text-lg font-bold text-bme-red leading-6">{i + 1}</span>
                      <span>
                        <span className="font-semibold group-hover:text-bme-red group-hover:underline underline-offset-4">
                          {guide.title}
                        </span>
                        <span className="mt-1 block text-sm text-ink-soft">{guide.description}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>

            {!user && (
              <section className="bg-bme-red p-6 text-white">
                <h2 className="font-serif text-xl font-bold">Your timetable, too</h2>
                <p className="mt-2 text-sm text-white/85">
                  Sign in with your BME eduID to see your courses and personal links.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-block bg-white px-4 py-2 text-sm font-semibold text-bme-red hover:bg-paper"
                >
                  Sign in
                </Link>
              </section>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
