export type OrderAddition = {
  id: string;
  weekStart: string;
  updatedAt: string;
  storeId: string;
  storeName: string;
  city: string;
  brand: string;
  product: string;
  tcin: string;
  cases: number;
};

export const ORDER_STORAGE_KEY = 'targetdfw-order-additions-v1';

export function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function readOrderAdditions(): OrderAddition[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeOrderAdditions(records: OrderAddition[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(records));
}

export function saveOrderAddition(input: Omit<OrderAddition, 'id' | 'weekStart' | 'updatedAt'>): OrderAddition[] {
  const weekStart = getWeekStart();
  const current = readOrderAdditions();
  const id = `${weekStart}-${input.storeId}-${input.tcin}`;
  const withoutExisting = current.filter((r) => r.id !== id);

  const next = input.cases > 0
    ? [
        ...withoutExisting,
        {
          ...input,
          id,
          weekStart,
          updatedAt: new Date().toISOString(),
        },
      ]
    : withoutExisting;

  writeOrderAdditions(next);
  return next;
}
