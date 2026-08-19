'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { stores } from '@/data/stores';
import { products } from '@/data/products';
import {
  ADDITIONAL_REGION_STORES,
  FORT_WORTH_REGION_IDS,
  DALLAS_REGION_IDS,
  AUSTIN_REGION_IDS,
  SAN_ANTONIO_REGION_IDS,
  WEST_TEXAS_REGION_IDS,
  EAST_TEXAS_REGION_IDS,
  SOUTH_TEXAS_REGION_IDS,
  EAST_HOUSTON_REGION_IDS,
  WEST_HOUSTON_REGION_IDS,
} from '@/data/regions';
import { getWeekStart, readOrderAdditions, saveOrderAddition } from '@/lib/orderTracking';

type Row = {
  key: string;
  storeId: string;
  store: string;
  city: string;
  brand: string;
  product: string;
  tcin: string;
  quantity: number | null;
  status: 'OOS' | 'LOW' | 'HEALTHY' | 'UNKNOWN';
  availability: string;
  fetchedAt?: string;
  error?: string;
};

const allStores = [...stores, ...ADDITIONAL_REGION_STORES];

const REGION_SETS: Record<string, Set<string>> = {
  FORT_WORTH: FORT_WORTH_REGION_IDS,
  DALLAS: DALLAS_REGION_IDS,
  AUSTIN: AUSTIN_REGION_IDS,
  SAN_ANTONIO: SAN_ANTONIO_REGION_IDS,
  WEST_TEXAS: WEST_TEXAS_REGION_IDS,
  EAST_TEXAS: EAST_TEXAS_REGION_IDS,
  SOUTH_TEXAS: SOUTH_TEXAS_REGION_IDS,
  EAST_HOUSTON: EAST_HOUSTON_REGION_IDS,
  WEST_HOUSTON: WEST_HOUSTON_REGION_IDS,
};

const REGION_LABELS: Record<string, string> = {
  FORT_WORTH: 'Fort Worth',
  DALLAS: 'Dallas',
  AUSTIN: 'Austin',
  SAN_ANTONIO: 'San Antonio',
  WEST_TEXAS: 'West Texas',
  EAST_TEXAS: 'East Texas',
  SOUTH_TEXAS: 'South Texas',
  EAST_HOUSTON: 'East Houston',
  WEST_HOUSTON: 'West Houston',
};

function storesForRegion(region: string) {
  const set = REGION_SETS[region];
  return set ? allStores.filter((s) => set.has(s.id)) : allStores;
}

function regionName(storeId: string) {
  for (const [key, set] of Object.entries(REGION_SETS)) {
    if (set.has(storeId)) return REGION_LABELS[key];
  }
  return 'Other / Unassigned';
}

const initialRows: Row[] = allStores.flatMap((store) =>
  products.map((product) => ({
    key: `${store.id}-${product.tcin}`,
    storeId: store.id,
    store: store.name,
    city: `${store.city}, ${store.state}`,
    brand: product.brand,
    product: product.name,
    tcin: product.tcin,
    quantity: null,
    status: 'UNKNOWN',
    availability: 'NOT_REFRESHED',
  }))
);

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function Home() {
  const [rows, setRows] = useState(initialRows);
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [selectedStoreId, setSelectedStoreId] = useState(allStores[0]?.id ?? '');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [busy, setBusy] = useState(false);
  const [casesByKey, setCasesByKey] = useState<Record<string, number>>({});

  useEffect(() => {
    const weekStart = getWeekStart();
    const map: Record<string, number> = {};
    for (const record of readOrderAdditions().filter((r) => r.weekStart === weekStart)) {
      map[`${record.storeId}-${record.tcin}`] = record.cases;
    }
    setCasesByKey(map);
  }, []);

  const regionStores = useMemo(() => storesForRegion(regionFilter), [regionFilter]);
  const selectedStore = allStores.find((s) => s.id === selectedStoreId);

  const filtered = useMemo(() =>
    rows
      .filter((r) => r.storeId === selectedStoreId)
      .filter((r) => statusFilter === 'ALL' || r.status === statusFilter)
      .filter((r) => brandFilter === 'ALL' || r.brand === brandFilter)
      .sort((a, b) => {
        const aQty = a.quantity === null ? Number.POSITIVE_INFINITY : a.quantity;
        const bQty = b.quantity === null ? Number.POSITIVE_INFINITY : b.quantity;
        return aQty - bQty || a.brand.localeCompare(b.brand) || a.product.localeCompare(b.product);
      }),
    [rows, selectedStoreId, statusFilter, brandFilter]
  );

  const selectedRows = useMemo(() => rows.filter((r) => r.storeId === selectedStoreId), [rows, selectedStoreId]);

  const counts = useMemo(() => selectedRows.reduce(
    (a, r) => ({ ...a, [r.status]: a[r.status] + 1 }),
    { OOS: 0, LOW: 0, HEALTHY: 0, UNKNOWN: 0 }
  ), [selectedRows]);

  const knownCount = counts.HEALTHY + counts.LOW + counts.OOS;
  const inStockRate = knownCount > 0 ? (counts.HEALTHY / knownCount) * 100 : null;
  const inStockClass = inStockRate === null ? 'neutral' : inStockRate >= 98.5 ? 'rateGreen' : inStockRate >= 95 ? 'rateYellow' : 'rateRed';
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), []);
  const selectedStoreCases = selectedRows.reduce((sum, r) => sum + (casesByKey[r.key] ?? 0), 0);
  const selectedStoreAddedValue = selectedRows.reduce((sum, r) => {
    const product = products.find((p) => p.tcin === r.tcin);
    const cases = casesByKey[r.key] ?? 0;
    return sum + (product?.casePrice ? product.casePrice * cases : 0);
  }, 0);

  async function refreshSelectedStore() {
    if (!selectedStoreId) return;
    setBusy(true);
    const next = [...rows];
    const indexes = next.map((row, index) => ({ row, index })).filter(({ row }) => row.storeId === selectedStoreId);

    for (const { row, index } of indexes) {
      try {
        const q = new URLSearchParams({ tcin: row.tcin, storeId: row.storeId });
        const res = await fetch(`/api/inventory?${q.toString()}`);
        const data = await res.json();
        next[index] = {
          ...row,
          quantity: data.quantity ?? null,
          status: data.status ?? 'UNKNOWN',
          availability: data.availability ?? 'UNKNOWN',
          fetchedAt: data.fetchedAt,
          error: data.error,
        };
      } catch {
        next[index] = { ...row, quantity: null, status: 'UNKNOWN', availability: 'CLIENT_ERROR', error: 'Could not refresh this item.' };
      }
      setRows([...next]);
    }
    setBusy(false);
  }

  function setCases(row: Row, cases: number) {
    const product = products.find((p) => p.tcin === row.tcin);
    saveOrderAddition({
      storeId: row.storeId,
      storeName: row.store,
      city: row.city,
      brand: row.brand,
      product: row.product,
      tcin: row.tcin,
      cases,
      casePrice: product?.casePrice,
    });
    setCasesByKey((current) => ({ ...current, [row.key]: cases }));
  }

  function exportCsv() {
    const header = ['Priority','Store','City','Brand','Product','TCIN','Reported Qty','Status','Cases Added','Case Price','Added Value','Availability','Fetched At','Error'];
    const escape = (v: unknown) => `"${String(v ?? '').replaceAll('"', '""')}"`;
    const body = filtered.map((r, idx) => {
      const product = products.find((p) => p.tcin === r.tcin);
      const cases = casesByKey[r.key] ?? 0;
      const addedValue = product?.casePrice ? Number((product.casePrice * cases).toFixed(2)) : '';
      return [idx + 1,r.store,r.city,r.brand,r.product,r.tcin,r.quantity,r.status,cases,product?.casePrice ?? '',addedValue,r.availability,r.fetchedAt,r.error].map(escape).join(',');
    });
    const blob = new Blob([[header.join(','), ...body].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `target-inventory-${selectedStoreId}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <header>
        <div>
          <div className="eyebrow">STORE-LEVEL INVENTORY ACTION</div>
          <h1>Target In-Stock Command Center</h1>
          <p>Select a region, choose a Target store, refresh it, then work the OOS and low inventory opportunities first.</p>
        </div>
        <div className="headerActions">
          <Link className="navButton" href="/orders">Case Additions Dashboard</Link>
          <button className="primary" onClick={refreshSelectedStore} disabled={busy || !selectedStoreId}>
            {busy ? 'Refreshing Store…' : 'Refresh Selected Store'}
          </button>
        </div>
      </header>

      <section className="controls">
        <select value={regionFilter} onChange={(e) => {
          const region = e.target.value;
          setRegionFilter(region);
          const nextStores = storesForRegion(region);
          if (!nextStores.some((s) => s.id === selectedStoreId)) setSelectedStoreId(nextStores[0]?.id ?? '');
          setStatusFilter('ALL');
        }}>
          <option value="ALL">All regions</option>
          <option value="FORT_WORTH">Fort Worth Region</option>
          <option value="DALLAS">Dallas Region</option>
          <option value="AUSTIN">Austin Region</option>
          <option value="SAN_ANTONIO">San Antonio Region</option>
          <option value="WEST_TEXAS">West Texas Region</option>
          <option value="EAST_TEXAS">East Texas Region</option>
          <option value="SOUTH_TEXAS">South Texas Region</option>
          <option value="EAST_HOUSTON">East Houston Region</option>
          <option value="WEST_HOUSTON">West Houston Region</option>
        </select>
        <select value={selectedStoreId} onChange={(e) => { setSelectedStoreId(e.target.value); setStatusFilter('ALL'); }}>
          {regionStores.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.city}</option>)}
        </select>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
          <option value="ALL">All brands</option>
          {brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="ALL">All statuses</option>
          <option value="OOS">OOS only</option>
          <option value="LOW">Low only</option>
          <option value="HEALTHY">Healthy only</option>
        </select>
        <button onClick={exportCsv}>Export Store</button>
      </section>

      {selectedStore && (
        <section className="storeCard">
          <div><strong>{selectedStore.name}</strong><span>{selectedStore.address}, {selectedStore.city}, {selectedStore.state}</span></div>
          <div><strong>Store ID {selectedStore.id}</strong><span>{products.length} tracked products</span></div>
          <div><strong>Region</strong><span>{regionName(selectedStore.id)}</span></div>
          <div><strong>Delivery</strong><span>{selectedStore.deliveryDays?.length ? selectedStore.deliveryDays.join(' / ') : 'Not loaded'}</span></div>
          <div><strong>Cases Added</strong><span>{selectedStoreCases} this week</span></div>
          <div><strong>Added $</strong><span>{money.format(selectedStoreAddedValue)} this week</span></div>
        </section>
      )}

      <section className="stats">
        <div className="stat danger"><strong>{counts.OOS}</strong><span>Out of Stock</span></div>
        <div className="stat warning"><strong>{counts.LOW}</strong><span>Low (1–2)</span></div>
        <div className="stat good"><strong>{counts.HEALTHY}</strong><span>Healthy</span></div>
        <div className={`stat rateCard ${inStockClass}`}>
          <strong>{inStockRate === null ? '—' : `${inStockRate.toFixed(1)}%`}</strong>
          <span>In-Stock Rate</span>
          <small>{knownCount > 0 ? `${counts.HEALTHY} / ${knownCount} healthy` : 'Refresh store to calculate'}</small>
        </div>
      </section>

      <section className="tableWrap">
        <table>
          <thead><tr><th>#</th><th>Brand</th><th>Item</th><th>Category</th><th>TCIN</th><th>Qty</th><th>Status</th><th>Qty Ordered</th><th>Case Price</th><th>Added $</th><th>Target Availability</th></tr></thead>
          <tbody>
            {filtered.map((r, idx) => {
              const product = products.find((p) => p.tcin === r.tcin);
              const cases = casesByKey[r.key] ?? 0;
              const addedValue = product?.casePrice !== undefined ? product.casePrice * cases : null;
              return (
                <tr key={r.key}>
                  <td>{idx + 1}</td><td>{r.brand}</td><td>{r.product}</td><td>{product?.category ?? ''}</td>
                  <td className="mono">{r.tcin}</td><td className="qty">{r.quantity ?? '—'}</td>
                  <td><span className={`pill ${r.status.toLowerCase()}`}>{r.status}</span></td>
                  <td>
                    <select className="caseSelect" aria-label={`Cases ordered for ${r.product}`} value={cases} onChange={(e) => setCases(r, Number(e.target.value))}>
                      <option value={0}>0</option><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option>
                    </select>
                  </td>
                  <td>{product?.casePrice !== undefined ? money.format(product.casePrice) : <span className="missingPrice">Missing</span>}</td>
                  <td className="moneyCell">{addedValue !== null ? money.format(addedValue) : '—'}</td>
                  <td>{r.availability}{r.error && <small className="error">{r.error}</small>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <footer>Reported quantity is Target fulfillment data, not a guaranteed physical shelf count. Case additions are tracked by sales week in this browser. Dollar value uses the discounted case price loaded in the product master.</footer>
    </main>
  );
}
