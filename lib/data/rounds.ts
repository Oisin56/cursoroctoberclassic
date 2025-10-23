import { Round } from '@/lib/types';

export const roundsData: Omit<Round, 'id'>[] = [
  {
    eventId: 'october-classic-2025',
    courseId: 'ballyliffin-old',
    sequence: 1,
    label: 'D1 AM',
    format: 'Strokeplay',
  },
  {
    eventId: 'october-classic-2025',
    courseId: 'ballyliffin-glashedy',
    sequence: 2,
    label: 'D1 PM',
    format: 'Strokeplay',
  },
  {
    eventId: 'october-classic-2025',
    courseId: 'portsalon',
    sequence: 3,
    label: 'D2 AM',
    format: 'Stableford',
  },
  {
    eventId: 'october-classic-2025',
    courseId: 'dunfanaghy',
    sequence: 4,
    label: 'D2 PM',
    format: 'Stableford',
  },
  {
    eventId: 'october-classic-2025',
    courseId: 'cruit-island',
    sequence: 5,
    label: 'D3 AM',
    format: 'Strokeplay',
  },
  {
    eventId: 'october-classic-2025',
    courseId: 'narin-portnoo',
    sequence: 6,
    label: 'D3 PM',
    format: 'Strokeplay',
  },
  {
    eventId: 'october-classic-2025',
    courseId: 'galway',
    sequence: 7,
    label: 'D4',
    format: 'Matchplay',
  },
  {
    eventId: 'october-classic-2025',
    courseId: 'mount-juliet',
    sequence: 8,
    label: 'D5',
    format: 'Strokeplay',
  },
];
