export const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
export const WEEK_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const DAY_LABELS = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const todayKey = (date = new Date()) => DAY_KEYS[date.getDay()]

// Returns 'open' | 'closed' | 'unknown' for a place at the given time.
export function openStatus(place, date = new Date()) {
  if (!place.hours) return 'unknown'
  const today = place.hours[todayKey(date)]
  if (!today) return 'closed'
  const now = date.getHours() * 60 + date.getMinutes()
  return now >= toMinutes(today[0]) && now < toMinutes(today[1]) ? 'open' : 'closed'
}

export function todayHoursLabel(place, date = new Date()) {
  if (!place.hours) return place.hoursNote ?? 'See source'
  const today = place.hours[todayKey(date)]
  return today ? `${today[0]}–${today[1]}` : 'Closed today'
}
