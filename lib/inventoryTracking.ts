export type InventorySnapshotRow = {
  tcin: string;
  quantity: number | null;
  status: 'OOS' | 'LOW' | 'HEALTHY' | 'UNKNOWN';
  availability: string;
};

export type StoreInventorySnapshot = {
  storeId: string;
  refreshedAt: string;
  rows: InventorySnapshotRow[];
};

export const INVENTORY_STORAGE_KEY = 'targetdfw-inventory-snapshots-v1';

export function readInventorySnapshots(): StoreInventorySnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeInventorySnapshots(records: StoreInventorySnapshot[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(records));
}

export function saveStoreInventorySnapshot(snapshot: StoreInventorySnapshot): StoreInventorySnapshot[] {
  const current = readInventorySnapshots();
  const next = [snapshot, ...current.filter((r) => r.storeId !== snapshot.storeId)];
  writeInventorySnapshots(next);
  return next;
}
