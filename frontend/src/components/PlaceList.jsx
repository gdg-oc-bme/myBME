import { openStatus, todayHoursLabel } from '../utils/hours.js'
import StatusBadge from './StatusBadge.jsx'

export default function PlaceList({ places }) {
  if (places.length === 0) return <p className="py-6 text-ink-soft">No places match your search.</p>

  return (
    <ul className="border-t border-ink">
      {places.map((place) => (
        <li key={place.id} className="grid grid-cols-[3rem_1fr_auto] gap-x-4 gap-y-1 py-4 border-b border-line">
          <span className="font-serif text-2xl font-bold text-bme-red leading-none pt-0.5" title="Building">
            {place.building.length > 2 ? place.building.slice(0, 3) : place.building}
          </span>
          <div className="min-w-0">
            <p className="font-semibold">
              {place.name}
              {!place.verified && (
                <span className="ml-2 align-middle text-[11px] font-normal uppercase tracking-wide text-ink-soft">
                  sample
                </span>
              )}
            </p>
            <p className="text-sm text-ink-soft">{place.location}</p>
            <p className="text-sm text-ink-soft sm:hidden mt-1">{todayHoursLabel(place)}</p>
          </div>
          <div className="text-right">
            <StatusBadge status={openStatus(place)} />
            <p className="hidden sm:block mt-1 text-sm text-ink-soft max-w-56">{todayHoursLabel(place)}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
