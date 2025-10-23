import { Course } from '@/lib/types';

// Helper to create blank holes
const createHoles = (count: number) => 
  Array.from({ length: count }, (_, i) => ({ number: i + 1 }));

export const coursesData: Course[] = [
  {
    id: 'ballyliffin-old',
    name: 'Ballyliffin Old',
    location: 'Ballyliffin, Co. Donegal',
    holes: createHoles(18),
  },
  {
    id: 'ballyliffin-glashedy',
    name: 'Ballyliffin Glashedy',
    location: 'Ballyliffin, Co. Donegal',
    holes: createHoles(18),
  },
  {
    id: 'portsalon',
    name: 'Portsalon Golf Club',
    location: 'Portsalon, Co. Donegal',
    holes: createHoles(18),
  },
  {
    id: 'dunfanaghy',
    name: 'Dunfanaghy Golf Club',
    location: 'Dunfanaghy, Co. Donegal',
    holes: createHoles(18),
  },
  {
    id: 'cruit-island',
    name: 'Cruit Island Golf Club',
    location: 'Cruit Island, Co. Donegal',
    holes: createHoles(9),
  },
  {
    id: 'narin-portnoo',
    name: 'Narin & Portnoo Golf Club',
    location: 'Narin, Co. Donegal',
    holes: createHoles(18),
  },
  {
    id: 'galway',
    name: 'Galway Golf Club (Salthill)',
    location: 'Galway',
    holes: createHoles(18),
  },
  {
    id: 'mount-juliet',
    name: 'Mount Juliet Golf Club',
    location: 'Thomastown, Co. Kilkenny',
    holes: createHoles(18),
  },
];
