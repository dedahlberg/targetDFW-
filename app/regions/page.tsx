'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { stores } from '@/data/stores';
import { products } from '@/data/products';
import { ADDITIONAL_REGION_STORES, FORT_WORTH_REGION_IDS, DALLAS_REGION_IDS, AUSTIN_REGION_IDS, SAN_ANTONIO_REGION_IDS, WEST_TEXAS_REGION_IDS, EAST_TEXAS_REGION_IDS, SOUTH_TEXAS_REGION_IDS, EAST_HOUSTON_REGION_IDS, WEST_HOUSTON_REGION_IDS } from '@/data/regions';
import { getWeekStart, readOrderAdditions, type OrderAddition } from '@/lib/orderTracking';
import { readInventorySnapshots, saveStoreInventorySnapshot, type StoreInventorySnapshot } from '@/lib/inventoryTracking';

const allStores = [...stores, ...ADDITIONAL_REGION_STORES];
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const REGION_SETS: Record<string, Set<string>> = {
  DALLAS: DALLAS_REGION_IDS,
  FORT_WORTH: FORT_WORTH_REGION_IDS,
  AUSTIN: AUSTIN_REGION_IDS,
  SAN_ANTONIO: SAN_ANTONIO_REGION_IDS,
  WEST_TEXAS: WEST_TEXAS_REGION_IDS,
  EAST_TEXAS: EAST_TEXAS_REGION_IDS,
  SOUTH_TEXAS: SOUTH_TEXAS_REGION_IDS,
  EAST_HOUSTON: EAST_HOUSTON_REGION_IDS,
  WEST_HOUSTON: WEST_HOUSTON_REGION_IDS,
};

const REGION_LABELS: Record<string, string> = {
  DALLAS: 'Dallas',
  FORT_WORTH: 'Fort Worth',
  AUSTIN: 'Austin',
  SAN_ANTONIO: 'San Antonio',
  WEST_TEXAS: 'West Texas',
  EAST_TEXAS: 'East Texas',
  SOUTH_TEXAS: 'South Texas',
  EAST_HOUSTON: 'East Houston',
  WEST_HOUSTON: 'West Houston',
};

type StoreSummary = {
  storeId: string;
  storeName: string;
  city: string;
  delivery: string;
  refreshedAt?: string;
  healthy: number;
  low: number;
  oos: number;
  rate: number | null;
  casesAdded: number;
  dollarsAdded: number;
};

function rateClass(rate: number | null) {
  if (rate === null) return 'unknown';
  if (rate >= 98.5) return 'healthy';
  if (rate >= 95) return 'low';
  return 'oos';
}

export default function RegionalDashboard() {
  const [region, setRegion] = useState('DALLAS');
  const [snapshots, setSnapshots] = useState<StoreInventorySnapshot[]>([]);
  const [orders, setOrders] = useState<OrderAddition[]>([]);
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState('');

  useEffect(() => {
    setSnapshots(readInventorySnapshots());
    setOrders(readOrderAdditions());
  }, []);

  const regionIds = REGION_SETS[region];
  const regionStores = useMemo(() => allStores.filter((s) => regionIds.has(s.id)), [regionIds]);
  const snapshotMap = useMemo(() => new Map(snapshots.map((s) => [s.storeId, s])), [snapshots]);
  const currentWeek = getWeekStart();
  const weekOrders = useMemo(() => orders.filter((r) => r.weekStart === currentWeek && regionIds.has(r.storeId)), [orders, currentWeek, regionIds]);

  const summaries = useMemo<StoreSummary[]>(() => regionStores.map((store) => {
    const snapshot = snapshotMap.get(store.id);
    const rows = snapshot?.rows ?? [];
    const healthy = rows.filter((r) => r.status === 'HEALTHY').length;
    const low = rows.filter((r) => r.status === 'LOW').length;
    const oos = rows.filter((r) => r.status === 'OOS').length;
    const known = healthy + low + oos;
    const storeOrders = weekOrders.filter((r) => r.storeId === store.id);
    return {
      storeId: store.id,
      storeName: store.name,
      city: `${store.city}, ${store.state}`,
      delivery: store.deliveryDays?.join(' / ') || 'Not loaded',
      refreshedAt: snapshot?.refreshedAt,
      healthy,
      low,
      oos,
      rate: known > 0 ? (healthy / known) * 100 : null,
      casesAdded: storeOrders.reduce((sum, r) => sum + r.cases, 0),
      dollarsAdded: storeOrders.reduce((sum, r) => sum + (r.addedValue ?? 0), 0),
    };
  }).sort((a, b) => {
    if (a.rate === null && b.rate !== null) return 1;
    if (a.rate !== null && b.rate === null) return -1;
    if (a.rate !== null && b.rate !== null && a.rate !== b.rate) return a.rate - b.rate;
    return (b.oos + b.low) - (a.oos + a.low) || a.storeName.localeCompare(b.storeName);
  }), [regionStores, snapshotMap, weekOrders]);

  const refreshed = summaries.filter((s) => s.refreshedAt);
  const totalHealthy = summaries.reduce((sum, s) => sum + s.healthy, 0);
  const totalLow = summaries.reduce((sum, s) => sum + s.low, 0);
  const totalOos = summaries.reduce((sum, s) => sum + s.oos, 0);
  const totalKnown = totalHealthy + totalLow + totalOos;
  const regionalRate = totalKnown > 0 ? (totalHealthy / totalKnown) * 100 : null;
  const totalCases = weekOrders.reduce((sum, r) => sum + r.cases, 0);
  const totalDollars = weekOrders.reduce((sum, r) => sum + (r.addedValue ?? 0), 0);

  async function refreshAllRegionStores() {
    if (refreshingAll || regionStores.length === 0) return;
    setRefreshingAll(true);

    try {
      for (let storeIndex = 0; storeIndex < regionStores.length; storeIndex++) {
        const store = regionStores[storeIndex];
        setRefreshProgress(`${storeIndex + 1} / ${regionStores.length} — ${store.name}`);
        const rows: StoreInventorySnapshot['rows'] = [];

        // Refresh in small batches so we move quickly without hammering Target with hundreds of requests at once.
        for (let i = 0; i < products.length; i += 4) {
          const batch = products.slice(i, i + 4);
          const results = await Promise.all(batch.map(async (product) => {
            try {
              const q = new URLSearchParams({ tcin: product.tcin, storeId: store.id });
              const res = await fetch(`/api/inventory?${q.toString()}`);
              const data = await res.json();
              return {
                tcin: product.tcin,
                quantity: data.quantity ?? null,
                status: data.status ?? 'UNKNOWN',
                availability: data.availability ?? 'UNKNOWN',
              } as StoreInventorySnapshot['rows'][number];
            } catch {
              return {
                tcin: product.tcin,
                quantity: null,
                status: 'UNKNOWN' as const,
                availability: 'CLIENT_ERROR',
              };
            }
          }));
          rows.push(...results);
        }

        saveStoreInventorySnapshot({
          storeId: store.id,
          refreshedAt: new Date().toISOString(),
          rows,
        });
        setSnapshots(readInventorySnapshots());
      }
      setRefreshProgress(`Complete — ${regionStores.length} stores refreshed`);
    } finally {
      setRefreshingAll(false);
    }
  }

  return (
    <main>
      <header>
        <div>
          <div className="eyebrow">REGIONAL PERFORMANCE VIEW</div>
          <h1>Target Regional In-Stock Dashboard</h1>
          <p>Switch regions to see total in-stock performance, store coverage, action items, and case additions.</p>
        </div>
        <div className="headerActions">
          <Link className="navButton" href="/">Store Dashboard</Link>
          <Link className="navButton" href="/orders">Case Additions Dashboard</Link>
        </div>
      </header>

      <section className="controls">
        <select value={region} disabled={refreshingAll} onChange={(e) => { setRegion(e.target.value); setRefreshProgress(''); }}>
          {Object.entries(REGION_LABELS).map(([key, label]) => <option key={key} value={key}>{label} Region</option>)}
        </select>
        <button className="primary" onClick={refreshAllRegionStores} disabled={refreshingAll}>
          {refreshingAll ? 'Refreshing Region…' : `Refresh All ${REGION_LABELS[region]} Stores`}
        </button>
        {refreshProgress && <span><strong>{refreshProgress}</strong></span>}
      </section>

      <section className="storeCard">
        <div><strong>{REGION_LABELS[region]} Region</strong><span>{regionStores.length} Target stores</span></div>
        <div><strong>Stores Refreshed</strong><span>{refreshed.length} / {regionStores.length}</span></div>
        <div><strong>Coverage</strong><span>{regionStores.length ? ((refreshed.length / regionStores.length) * 100).toFixed(0) : 0}%</span></div>
        <div><strong>Sales Week</strong><span>Week of {currentWeek}</span></div>
      </section>

      <section className="stats orderStats">
        <div className={`stat rateCard ${regionalRate === null ? 'neutral' : regionalRate >= 98.5 ? 'rateGreen' : regionalRate >= 95 ? 'rateYellow' : 'rateRed'}`}>
          <strong>{regionalRate === null ? '—' : `${regionalRate.toFixed(1)}%`}</strong>
          <span>Regional In-Stock</span>
          <small>{totalKnown > 0 ? `${totalHealthy} / ${totalKnown} healthy` : 'Refresh stores to calculate'}</small>
        </div>
        <div className="stat danger"><strong>{totalOos}</strong><span>Out of Stock Items</span><small>Refreshed stores</small></div>
        <div className="stat warning"><strong>{totalLow}</strong><span>Low Items (1–2)</span><small>Refreshed stores</small></div>
        <div className="stat neutral"><strong>{totalOos + totalLow}</strong><span>Needs Action</span><small>OOS + Low</small></div>
        <div className="stat good"><strong>{totalCases}</strong><span>Cases Added This Week</span><small>{REGION_LABELS[region]} Region</small></div>
        <div className="stat good"><strong>{money.format(totalDollars)}</strong><span>Added $ This Week</span><small>Known case prices</small></div>
      </section>

      <section className="analysisSection">
        <div className="sectionTitle"><div><h2>{REGION_LABELS[region]} Store Ranking</h2><p>Lowest in-stock stores and highest action opportunities appear first. Unrefreshed stores appear at the bottom.</p></div></div>
        <div className="tableWrap">
          <table>
            <thead><tr><th>Store</th><th>City</th><th>Delivery</th><th>In-Stock</th><th>OOS</th><th>Low</th><th>Needs Action</th><th>Cases Added</th><th>Added $</th><th>Last Refreshed</th></tr></thead>
            <tbody>
              {summaries.map((s) => (
                <tr key={s.storeId}>
                  <td>{s.storeName}</td><td>{s.city}</td><td>{s.delivery}</td>
                  <td><span className={`pill ${rateClass(s.rate)}`}>{s.rate === null ? 'Not refreshed' : `${s.rate.toFixed(1)}%`}</span></td>
                  <td className="qty">{s.oos}</td><td className="qty">{s.low}</td><td className="qty">{s.oos + s.low}</td>
                  <td className="qty">{s.casesAdded}</td><td className="moneyCell">{money.format(s.dollarsAdded)}</td>
                  <td>{s.refreshedAt ? new Date(s.refreshedAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer>Regional in-stock uses only refreshed, known item results. Low and OOS items count against in-stock; unknown items are excluded from the rate. Store refreshes are saved in this browser.</footer>
    </main>
  );
}
