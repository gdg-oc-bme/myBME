import { openStatus, todayHoursLabel } from '../utils/hours.js'
import StatusBadge from './StatusBadge.jsx'

export default function PlaceList({ places }) {
  if (places.length === 0) return <p className="text-ink-soft">No places match your search.</p>

  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-white">
      {places.map((place) => (
        <li key={place.id} className="flex items-center gap-4 p-4">
          <span
            className="grid place-items-center size-10 shrink-0 rounded-md bg-ink text-white text-xs font-bold"
            title="Building"
          >
            {place.building.length > 2 ? place.building.slice(0, 3) : place.building}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium">
              {place.name}
              {!place.verified && <span className="ml-2 text-xs font-normal text-ink-soft">(sample)</span>}
            </p>
            <p className="text-sm text-ink-soft truncate">{place.location}</p>
          </div>
          <div className="hidden sm:block text-right text-sm text-ink-soft">{todayHoursLabel(place)}</div>
          <StatusBadge status={openStatus(place)} />
        </li>
      ))}
    </ul>
  )
}
