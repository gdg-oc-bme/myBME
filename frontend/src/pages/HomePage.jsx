import { Search } from 'lucide-react'
import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import PlaceList from '../components/PlaceList.jsx'
import QuickLinks from '../components/QuickLinks.jsx'
import Section from '../components/Section.jsx'
import { quickLinks } from '../data/links.js'
import { categories, places } from '../data/places.js'

const matches = (query, ...fields) => {
  const q = query.trim().toLowerCase()
  return !q || fields.some((f) => f?.toLowerCase().includes(q))
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const visibleLinks = quickLinks.filter((l) => matches(query, l.title, l.description))
  const visiblePlaces = places.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      matches(query, p.name, p.description, p.location, `building ${p.building}`),
  )

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="pt-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold">Everything on campus, in one place.</h1>
        <p className="mt-2 text-ink-soft">Offices, printing, library and study spaces for every BME student.</p>

        <div className="mt-6 relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-ink-soft" aria-hidden="true" />
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. “print”, “library”, “building Q”"
            className="w-full rounded-lg border border-line bg-white pl-10 pr-4 py-3 focus:border-bme-red focus:outline-none focus:ring-2 focus:ring-bme-red/20"
          />
        </div>
      </section>

      <Section title="Quick links">
        <QuickLinks links={visibleLinks} />
      </Section>

      <Section
        title="Places"
        action={
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        }
      >
        <PlaceList places={visiblePlaces} />
      </Section>

      <div className="mt-10 rounded-lg border border-dashed border-ink/20 p-5 flex items-center gap-4">
        <Icon name="graduation" className="size-6 text-bme-red shrink-0" />
        <p className="text-sm text-ink-soft">
          Sign in with your BME eduID to see your courses, timetable and personal dashboard.
        </p>
      </div>
    </div>
  )
}
