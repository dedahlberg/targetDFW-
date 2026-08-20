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

export function isUnavailableInventory(row: Pick<InventorySnapshotRow, 'quantity' | 'availability'>) {
  if (row.quantity !== null) return false;
  const value = String(row.availability || '').toUpperCase();
  return value.includes('UNAVAILABLE') ||
    value.includes('NOT_AVAILABLE') ||
    value.includes('NOT AVAILABLE') ||
    value === 'NO_INVENTORY_DATA';
}

export function normalizedInventoryStatus(row: InventorySnapshotRow): InventorySnapshotRow['status'] {
  return isUnavailableInventory(row) ? 'UNKNOWN' : row.status;
}

export function readInventorySnapshots(): StoreInventorySnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((snapshot: StoreInventorySnapshot) => ({
      ...snapshot,
      rows: Array.isArray(snapshot.rows)
        ? snapshot.rows.map((row) => ({ ...row, status: normalizedInventoryStatus(row) }))
        : [],
    }));
  } catch {
    return [];
  }
}

export function writeInventorySnapshots(records: StoreInventorySnapshot[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(records));
}

export function saveStoreInventorySnapshot(snapshot: StoreInventorySnapshot): StoreInventorySnapshot[] {
  const normalized: StoreInventorySnapshot = {
    ...snapshot,
    rows: snapshot.rows.map((row) => ({ ...row, status: normalizedInventoryStatus(row) })),
  };
  const current = readInventorySnapshots();
  const next = [normalized, ...current.filter((r) => r.storeId !== normalized.storeId)];
  writeInventorySnapshots(next);
  return next;
}
