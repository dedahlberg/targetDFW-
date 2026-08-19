export type Store = {
  id: string;
  name: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
};

export const stores: Store[] = [
  { id: '1784', name: 'Demo Target - Frisco Area', city: 'Frisco', state: 'TX', zip: '75034', latitude: 33.1507, longitude: -96.8236 },
  { id: '0875', name: 'Demo Target - Denton Area', city: 'Denton', state: 'TX', zip: '76201', latitude: 33.2148, longitude: -97.1331 },
  { id: '2516', name: 'Demo Target - Plano Area', city: 'Plano', state: 'TX', zip: '75024', latitude: 33.0757, longitude: -96.8230 }
];
