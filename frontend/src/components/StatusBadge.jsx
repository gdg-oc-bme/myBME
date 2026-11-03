const styles = {
  open: { dot: 'bg-green-600', text: 'text-green-800', label: 'Open now' },
  closed: { dot: 'bg-ink/25', text: 'text-ink-soft', label: 'Closed' },
  unknown: { dot: 'bg-amber-500', text: 'text-amber-800', label: 'Check hours' },
}

export default function StatusBadge({ status }) {
  const s = styles[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${s.text}`}>
      <span className={`size-2 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  )
}
