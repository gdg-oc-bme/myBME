// Campus places shown on the dashboard.
//
// The backend team will replace this file with an API later; the shape below
// is what the UI expects:
//   hours    – { mon..sun: ['HH:MM', 'HH:MM'] } (missing day = closed),
//              or null when the hours change often (see hoursNote)
//   verified – true only if checked against an official source (put it in `source`).
//              Unverified entries are shown with a "Sample data" badge.

export const categories = [
  { id: 'printing', label: 'Printing & copying', icon: 'printer' },
  { id: 'office', label: 'Student offices', icon: 'office' },
  { id: 'library', label: 'Library', icon: 'library' },
  { id: 'food', label: 'Food & coffee', icon: 'food' },
  { id: 'study', label: 'Study spaces', icon: 'study' },
]

const weekdays = (open, close) => ({
  mon: [open, close],
  tue: [open, close],
  wed: [open, close],
  thu: [open, close],
  fri: [open, close],
})

export const places = [
  {
    id: 'etk-customer-service',
    name: 'ETK Customer Service',
    category: 'office',
    building: 'R',
    location: 'Building R (moved here in September 2026)',
    description: 'Central academic service centre: certificates, student status, Neptun issues.',
    hours: null,
    hoursNote: 'Hours vary by day – check the ETK site.',
    verified: true,
    source: 'https://etk.bme.hu/',
  },
  {
    id: 'etk-secretariat',
    name: 'ETK Secretariat – Diploma collection',
    category: 'office',
    building: 'R',
    location: 'Building R, ground floor, room 6',
    description: 'Diplomas can be collected on Wednesdays and Fridays during office hours.',
    hours: null,
    hoursNote: 'Wednesdays and Fridays, during office hours.',
    verified: true,
    source: 'https://etk.bme.hu/',
  },
  {
    id: 'omikk-main',
    name: 'Central Library (OMIKK)',
    category: 'library',
    building: 'Library',
    location: 'Budafoki út 4–6, Budapest',
    description: 'Lending, main reading room, textbook reading room and community spaces.',
    hours: weekdays('08:00', '20:00'),
    verified: true,
    source: 'https://www.omikk.bme.hu/',
  },
  {
    id: 'omikk-study',
    name: 'Library community spaces',
    category: 'study',
    building: 'Library',
    location: 'Budafoki út 4–6, upper floor community room',
    description: 'Group study rooms inside the Central Library.',
    hours: weekdays('08:00', '20:00'),
    verified: true,
    source: 'https://www.omikk.bme.hu/',
  },

  // --- Sample entries below: layout placeholders until the team collects real data ---
  {
    id: 'print-k',
    name: 'Copy & print point',
    category: 'printing',
    building: 'K',
    location: 'Building K, ground floor',
    description: 'Self-service copying and printing. Card payment.',
    hours: weekdays('08:00', '18:00'),
    verified: false,
  },
  {
    id: 'print-q',
    name: 'Copy & print point',
    category: 'printing',
    building: 'Q',
    location: 'Building Q, wing B, ground floor',
    description: 'Printing from USB and e-mail, binding service.',
    hours: weekdays('09:00', '17:00'),
    verified: false,
  },
  {
    id: 'print-i',
    name: 'Self-service printer',
    category: 'printing',
    building: 'I',
    location: 'Building I, entrance hall',
    description: 'Black & white and colour printing.',
    hours: { ...weekdays('07:30', '20:00'), sat: ['08:00', '14:00'] },
    verified: false,
  },
  {
    id: 'cafe-k',
    name: 'Café',
    category: 'food',
    building: 'K',
    location: 'Building K, ground floor',
    description: 'Coffee, sandwiches and snacks.',
    hours: weekdays('07:30', '16:00'),
    verified: false,
  },
  {
    id: 'canteen-q',
    name: 'Canteen',
    category: 'food',
    building: 'Q',
    location: 'Building Q, ground floor',
    description: 'Daily menu at lunchtime.',
    hours: weekdays('11:00', '15:00'),
    verified: false,
  },
  {
    id: 'study-q',
    name: 'Student lounge',
    category: 'study',
    building: 'Q',
    location: 'Building Q, wing A, 1st floor',
    description: 'Quiet seating with power outlets.',
    hours: weekdays('07:00', '21:00'),
    verified: false,
  },
]
