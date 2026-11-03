import { quickLinks } from '../data/links.js'
import { useAuth } from '../auth/auth.js'
import QuickLinks from '../components/QuickLinks.jsx'
import Section from '../components/Section.jsx'

function Card({ title, children }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <h2 className="font-serif text-lg font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10">
      <div className="flex items-center gap-4">
        <span className="grid place-items-center size-14 rounded-full bg-bme-red text-white text-lg font-bold">
          {initials}
        </span>
        <div>
          <h1 className="font-serif text-2xl font-bold">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-ink-soft">
            {user.programme} · {user.semester}
          </p>
        </div>
        <span className="ml-auto rounded bg-amber-50 px-2 py-1 text-xs text-amber-800 ring-1 ring-amber-600/20">
          Demo data
        </span>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card title="Today">
            <ul className="divide-y divide-line">
              {user.today.map((item) => (
                <li key={item.time} className="flex gap-4 py-3 text-sm">
                  <span className="w-24 shrink-0 font-medium tabular-nums">{item.time}</span>
                  <span>
                    <span className="font-medium">{item.course}</span>
                    <span className="text-ink-soft"> · {item.type}</span>
                    <span className="block text-ink-soft">{item.room}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card title="Profile">
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-ink-soft">Neptun code</dt>
              <dd className="font-medium">{user.neptun}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">E-mail</dt>
              <dd className="font-medium break-all">{user.email}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Faculty</dt>
              <dd className="font-medium">{user.faculty}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Section title="My courses this semester">
        <ul className="grid gap-3 sm:grid-cols-2">
          {user.courses.map((course) => (
            <li key={course.code} className="rounded-lg border border-line bg-white p-4">
              <p className="text-xs font-semibold text-bme-red">{course.code}</p>
              <p className="mt-1 font-medium">{course.name}</p>
              <p className="mt-1 text-sm text-ink-soft">
                {course.credits} credits · {course.room}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Quick links">
        <QuickLinks links={quickLinks.slice(0, 4)} />
      </Section>
    </div>
  )
}
