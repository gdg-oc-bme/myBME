const styles = {
  open: 'bg-green-50 text-green-800 ring-green-600/20',
  closed: 'bg-paper text-ink-soft ring-ink/10',
  unknown: 'bg-amber-50 text-amber-800 ring-amber-600/20',
}

const labels = {
  open: 'Open now',
  closed: 'Closed',
  unknown: 'Check hours',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}>
      {status === 'open' && <span className="size-1.5 rounded-full bg-green-600" aria-hidden="true" />}
      {labels[status]}
    </span>
  )
}
