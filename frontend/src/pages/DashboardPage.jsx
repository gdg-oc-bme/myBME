import { useEffect, useState } from 'react'
import { apiGet } from '../api/client.js'
import { useAuth } from '../auth/auth.js'
import { sampleCourses, sampleToday } from '../data/sampleTimetable.js'

function SampleTag() {
  return <span className="ml-2 align-middle text-[11px] font-normal uppercase tracking-wide text-ink-soft">sample</span>
}

// Same shape as GET /api/dashboard/, used when signed in with the dev-only demo account.
const demoServices = [
  { name: 'Moodle', url: '', sso: true },
  { name: 'Neptun', url: 'https://kth.bme.hu/ext/frame/info.html', sso: false },
]

function useLinkedServices(isDemo) {
  const [state, setState] = useState(
    isDemo ? { status: 'ready', services: demoServices } : { status: 'loading', services: [] },
  )

  useEffect(() => {
    if (isDemo) return
    let cancelled = false
    apiGet('/api/dashboard/')
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', services: data.services })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', services: [] })
      })
    return () => {
      cancelled = true
    }
  }, [isDemo])

  return state
}

export default function DashboardPage() {
  const { status, user } = useAuth()
  const services = useLinkedServices(status === 'demo')
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/60">My BME</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold">Welcome, {user.first_name || fullName}</h1>
          <p className="mt-2 text-white/70">{user.email}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-bold mb-4">
              Today
              <SampleTag />
            </h2>
            <ul className="border-t border-ink">
              {sampleToday.map((item) => (
                <li key={item.time} className="grid grid-cols-[4.5rem_1fr] gap-4 py-4 border-b border-line">
                  <span className="tabular-nums">
                    <span className="block font-semibold">{item.time}</span>
                    <span className="block text-sm text-ink-soft">{item.end}</span>
                  </span>
                  <span>
                    <span className="block font-semibold">{item.course}</span>
                    <span className="block text-sm text-ink-soft">
                      {item.type} · {item.room}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold mb-4">
              Courses this semester
              <SampleTag />
            </h2>
            <ul className="border-t border-ink">
              {sampleCourses.map((course) => (
                <li key={course.code} className="flex items-baseline justify-between gap-4 py-3 border-b border-line">
                  <span>
                    <span className="font-semibold">{course.name}</span>
                    <span className="ml-2 text-sm text-ink-soft">{course.code}</span>
                  </span>
                  <span className="text-sm text-ink-soft whitespace-nowrap">{course.credits} credits</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-10">
          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Your services</h2>
            {services.status === 'loading' && <p className="text-sm text-ink-soft">Loading…</p>}
            {services.status === 'error' && (
              <p className="text-sm text-ink-soft">Couldn’t load your services right now.</p>
            )}
            {services.status === 'ready' && (
              <ul className="border-t border-ink">
                {services.services.map((s) => (
                  <li key={s.name} className="py-3 border-b border-line">
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold hover:text-bme-red hover:underline underline-offset-4"
                      >
                        {s.name} <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="font-semibold text-ink-soft">{s.name}</span>
                    )}
                    <span className="block text-sm text-ink-soft">
                      {s.sso ? 'Signs you in automatically' : 'Separate login'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-4">Profile</h2>
            <dl className="border-t border-ink text-sm">
              {[
                ['Name', fullName],
                ['E-mail', user.email],
                ['eduID', user.username],
              ].map(([label, value]) => (
                <div key={label} className="py-3 border-b border-line">
                  <dt className="text-ink-soft">{label}</dt>
                  <dd className="font-medium break-all">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </>
  )
}
