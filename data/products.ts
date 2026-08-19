export type Product = {
  tcin: string;
  brand: string;
  name: string;
  category: string;
  casePrice?: number;
};

export const products: Product[] = [
  // RED BARON
  { tcin: '13374155', brand: 'Red Baron', name: 'Pepperoni French Bread Pizza 2pk', category: 'French Bread Pizza', casePrice: 38.28 },
  { tcin: '13374241', brand: 'Red Baron', name: 'Five Cheese & Garlic French Bread Pizza 2pk', category: 'French Bread Pizza', casePrice: 38.28 },
  { tcin: '13376389', brand: 'Red Baron', name: 'Pepperoni Classic Crust Pizza', category: 'Frozen Pizza', casePrice: 67.20 },
  { tcin: '13333997', brand: 'Red Baron', name: 'Supreme Classic Crust Pizza', category: 'Frozen Pizza', casePrice: 67.20 },
  { tcin: '13374407', brand: 'Red Baron', name: 'Four Meat Classic Crust Pizza', category: 'Frozen Pizza', casePrice: 67.20 },
  { tcin: '13334001', brand: 'Red Baron', name: 'Special Deluxe Classic Crust Pizza', category: 'Frozen Pizza' },
  { tcin: '13373589', brand: 'Red Baron', name: 'Pepperoni Thin Crust Pizza', category: 'Frozen Pizza', casePrice: 67.20 },
  { tcin: '94194523', brand: 'Red Baron', name: 'Pepperoni Stuffed Crust Pizza', category: 'Frozen Pizza', casePrice: 75.48 },
  { tcin: '87545526', brand: 'Red Baron', name: 'Fully Loaded Pepperoni Pizza', category: 'Frozen Pizza', casePrice: 88.06 },
  { tcin: '87545525', brand: 'Red Baron', name: "Fully Loaded Meat Lover's Pizza", category: 'Frozen Pizza', casePrice: 88.06 },

  // FRESCHETTA
  { tcin: '13374368', brand: 'Freschetta', name: 'Pepperoni Naturally Rising Crust Pizza', category: 'Frozen Pizza', casePrice: 73.36 },
  { tcin: '13376392', brand: 'Freschetta', name: 'Four Cheese Medley Naturally Rising Crust Pizza', category: 'Frozen Pizza', casePrice: 73.36 },
  { tcin: '13333998', brand: 'Freschetta', name: 'Canadian Bacon & Pineapple Naturally Rising Crust Pizza', category: 'Frozen Pizza', casePrice: 73.36 },
  { tcin: '13376464', brand: 'Freschetta', name: 'Pepperoni Brick Oven Crust Pizza', category: 'Frozen Pizza', casePrice: 83.84 },
  { tcin: '13374416', brand: 'Freschetta', name: 'Five Cheese Brick Oven Crust Pizza', category: 'Frozen Pizza', casePrice: 83.84 },
  { tcin: '31168520', brand: 'Freschetta', name: 'Pepperoni Gluten Free Thin Crust Pizza', category: 'Gluten Free Pizza', casePrice: 101.52 },
  { tcin: '16222856', brand: 'Freschetta', name: 'Four Cheese Medley Gluten Free Thin Crust Pizza', category: 'Gluten Free Pizza', casePrice: 101.52 },

  // BIBIGO SINGLE SERVE
  { tcin: '93374362', brand: 'Bibigo', name: 'Beef & Vegetable Bibimbap Bowl', category: 'Single Serve Meal', casePrice: 25.92 },
  { tcin: '93374359', brand: 'Bibigo', name: 'Chicken & Vegetable Bibimbap Bowl', category: 'Single Serve Meal', casePrice: 25.92 },
  { tcin: '93374365', brand: 'Bibigo', name: 'Beef & Vegetable Japchae Noodles', category: 'Single Serve Meal', casePrice: 25.92 },
  { tcin: '93374381', brand: 'Bibigo', name: 'Chicken & Vegetable Japchae Noodles', category: 'Single Serve Meal', casePrice: 25.92 },
  { tcin: '93374363', brand: 'Bibigo', name: 'Chicken Wonton Soup', category: 'Single Serve Meal' },

  // BIBIGO DUMPLINGS / WONTONS / MANDU
  { tcin: '81251225', brand: 'Bibigo', name: 'Mandu Pork & Vegetable Dumplings 24oz', category: 'Dumplings', casePrice: 48.51 },
  { tcin: '81251223', brand: 'Bibigo', name: 'Mini Wontons Chicken & Vegetable 24oz', category: 'Wontons', casePrice: 48.51 },
  { tcin: '82001058', brand: 'Bibigo', name: 'Mini Wontons Pork & Vegetable 24oz', category: 'Wontons' },
  { tcin: '87544467', brand: 'Bibigo', name: 'Chicken & Vegetable Steamed Dumplings 6.6oz', category: 'Steamed Dumplings', casePrice: 23.31 },
  { tcin: '87604330', brand: 'Bibigo', name: 'Pork & Vegetable Steamed Dumplings 6.6oz', category: 'Steamed Dumplings', casePrice: 23.31 },
  { tcin: '87544470', brand: 'Bibigo', name: 'Spicy Chicken & Vegetable Crispy Dumpling Bites', category: 'Dumplings', casePrice: 36.96 }
];
