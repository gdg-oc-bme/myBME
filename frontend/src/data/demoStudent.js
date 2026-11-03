// Fake student used by the demo login. Will be replaced by data from
// the backend (eduID profile + Neptun courses).
export const demoStudent = {
  name: 'Demo Student',
  neptun: 'ABC123',
  email: 'demo.student@edu.bme.hu',
  faculty: 'Faculty of Electrical Engineering and Informatics',
  programme: 'Computer Engineering BSc',
  semester: '2026/27 autumn',

  courses: [
    { code: 'COURSE01', name: 'Course name 1', credits: 6, room: 'Building Q, room B-201' },
    { code: 'COURSE02', name: 'Course name 2', credits: 5, room: 'Building K, room 160' },
    { code: 'COURSE03', name: 'Course name 3', credits: 4, room: 'Building I, room 028' },
    { code: 'COURSE04', name: 'Course name 4', credits: 4, room: 'Building E, room 1A' },
  ],

  today: [
    { time: '08:15–10:00', course: 'Course name 1', type: 'Lecture', room: 'Building Q, room B-201' },
    { time: '10:15–12:00', course: 'Course name 3', type: 'Practice', room: 'Building I, room 028' },
    { time: '14:15–16:00', course: 'Course name 2', type: 'Lab', room: 'Building K, room 160' },
  ],
}
