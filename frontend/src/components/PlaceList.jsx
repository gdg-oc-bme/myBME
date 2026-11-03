import { openStatus, todayHoursLabel } from '../utils/hours.js'
import StatusBadge from './StatusBadge.jsx'

export default function PlaceList({ places }) {
  if (places.length === 0) return <p className="px-5 py-8 text-ink-soft">Nothing matches – try another search.</p>

  return (
    <ul className="divide-y divide-line">
      {places.map((place) => (
        <li key={place.id} className="flex items-start gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {place.name}
              {!place.verified && <span className="ml-2 text-xs font-normal text-ink-soft">(sample)</span>}
            </p>
            <p className="text-sm text-ink-soft">{place.location}</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <StatusBadge status={openStatus(place)} />
            <p className="text-xs text-ink-soft max-w-48">{todayHoursLabel(place)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
