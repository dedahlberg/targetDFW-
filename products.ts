export type Product = {
  tcin: string;
  brand: string;
  name: string;
  category: string;
};

// Replace/add TCINs in this file, or connect the next phase Product Master importer.
export const products: Product[] = [
  { tcin: '14758453', brand: 'Demo', name: 'Target API Test Item', category: 'Test' },
  { tcin: '80130847', brand: 'Demo', name: 'Target API Test Item 2', category: 'Test' }
];
