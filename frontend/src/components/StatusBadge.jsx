const styles = {
  open: { pill: 'bg-green-100 text-green-800', label: 'Open' },
  closed: { pill: 'bg-paper text-ink-soft', label: 'Closed' },
  unknown: { pill: 'bg-amber-100 text-amber-900', label: 'Check hours' },
}

export default function StatusBadge({ status }) {
  const s = styles[status]
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${s.pill}`}>
      {s.label}
    </span>
  )
}
