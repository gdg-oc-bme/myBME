import Icon from './Icon.jsx'

export default function QuickLinks({ links }) {
  if (links.length === 0) return <p className="text-ink-soft">No links match your search.</p>

  return (
    <ul className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-full items-center gap-3 rounded-lg border border-line bg-white p-3 text-sm font-medium hover:border-bme-red hover:text-bme-red"
          >
            <Icon name={link.icon} className="size-5 shrink-0 text-bme-red" />
            {link.title}
          </a>
        </li>
      ))}
    </ul>
  )
}
