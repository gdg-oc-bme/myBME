import { useEffect, useState } from 'react'
import { apiGet } from '../api/client.js'
import { useAuth } from '../auth/auth.js'
import { sampleCourses, sampleToday } from '../data/sampleTimetable.js'

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

function Panel({ title, sample, children }) {
  return (
    <section className="rounded-2xl bg-white p-5">
      <h2 className="font-display text-xl font-bold">
        {title}
        {sample && (
          <span className="ml-2 rounded-full bg-cream px-2 py-0.5 align-middle font-sans text-xs font-medium text-ink-soft">
            sample data
          </span>
        )}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function DashboardPage() {
  const { status, user } = useAuth()
  const services = useLinkedServices(status === 'demo')
  const [now] = useState(() => new Date())
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username
  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="mt-10">
        <p className="text-sm font-medium text-ink-soft">
          <span className="mr-2 inline-block size-2 rounded-full bg-bme-red align-middle" aria-hidden="true" />
          {today}
        </p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight">
          Hi, <span className="text-bme-red">{user.first_name || fullName}</span>.
        </h1>
        <p className="mt-2 text-ink-soft">
          You have {sampleToday.length} classes today. The first starts at {sampleToday[0].time}.
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Panel title="Today" sample>
            <ol className="relative ml-2 border-l-2 border-bme-red-50">
              {sampleToday.map((item) => (
                <li key={item.time} className="relative pb-6 pl-6 last:pb-0">
                  <span
                    className="absolute -left-[7px] top-1.5 size-3 rounded-full bg-bme-red ring-4 ring-white"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold tabular-nums text-bme-red">
                    {item.time}–{item.end}
                  </p>
                  <p className="mt-0.5 font-semibold">{item.course}</p>
                  <p className="text-sm text-ink-soft">
                    {item.type} · {item.room}
                  </p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="This semester" sample>
            <ul className="grid gap-3 sm:grid-cols-2">
              {sampleCourses.map((course) => (
                <li key={course.code} className="rounded-xl bg-cream px-4 py-3">
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-sm text-ink-soft">
                    {course.code} · {course.credits} credits
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Your services">
            {services.status === 'loading' && <p className="text-sm text-ink-soft">Loading…</p>}
            {services.status === 'error' && (
              <p className="text-sm text-ink-soft">Couldn’t load your services right now.</p>
            )}
            {services.status === 'ready' && (
              <ul className="space-y-2">
                {services.services.map((s) => {
                  const body = (
                    <>
                      <span>
                        <span className="block font-semibold">{s.name}</span>
                        <span className="block text-xs text-ink-soft">
                          {s.sso ? 'Signs you in automatically' : 'Separate login'}
                        </span>
                      </span>
                      {s.url && <span aria-hidden="true">→</span>}
                    </>
                  )
                  return (
                    <li key={s.name}>
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 hover:bg-bme-red-50 hover:text-bme-red"
                        >
                          {body}
                        </a>
                      ) : (
                        <div className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-ink-soft">
                          {body}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Profile">
            <dl className="space-y-3 text-sm">
              {[
                ['Name', fullName],
                ['E-mail', user.email],
                ['eduID', user.username],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-ink-soft">{label}</dt>
                  <dd className="font-medium break-all">{value || '—'}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  )
}
