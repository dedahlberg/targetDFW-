'use client';

import { useMemo, useState } from 'react';
import { stores } from '@/data/stores';
import { products } from '@/data/products';

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

const initialRows: Row[] = stores.flatMap((store) =>
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

const priority = {
  OOS: 0,
  LOW: 1,
  UNKNOWN: 2,
  HEALTHY: 3,
} as const;

export default function Home() {
  const [rows, setRows] = useState(initialRows);
  const [storeFilter, setStoreFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(
    () =>
      rows
        .filter((r) => storeFilter === 'ALL' || r.storeId === storeFilter)
        .filter((r) => statusFilter === 'ALL' || r.status === statusFilter)
        .sort(
          (a, b) =>
            priority[a.status] - priority[b.status] ||
            a.store.localeCompare(b.store)
        ),
    [rows, storeFilter, statusFilter]
  );

  const counts = useMemo(
    () =>
      rows.reduce(
        (a, r) => ({
          ...a,
          [r.status]: a[r.status] + 1,
        }),
        {
          OOS: 0,
          LOW: 0,
          HEALTHY: 0,
          UNKNOWN: 0,
        }
      ),
    [rows]
  );

  async function refresh() {
    setBusy(true);

    const next = [...rows];

    for (let i = 0; i < next.length; i++) {
      const row = next[i];

      try {
        const q = new URLSearchParams({
          tcin: row.tcin,
          storeId: row.storeId,
        });

        const res = await fetch(`/api/inventory?${q.toString()}`);
        const data = await res.json();

        next[i] = {
          ...row,
          quantity: data.quantity ?? null,
          status: data.status ?? 'UNKNOWN',
          availability: data.availability ?? 'UNKNOWN',
          fetchedAt: data.fetchedAt,
          error: data.error,
        };
      } catch {
        next[i] = {
          ...row,
          quantity: null,
          status: 'UNKNOWN',
          availability: 'CLIENT_ERROR',
          error: 'Could not refresh this item.',
        };
      }

      setRows([...next]);
    }

    setBusy(false);
  }

  function exportCsv() {
    const header = [
      'Priority',
      'Store',
      'City',
      'Brand',
      'Product',
      'TCIN',
      'Reported Qty',
      'Status',
      'Availability',
      'Fetched At',
      'Error',
    ];

    const escape = (v: unknown) =>
      `"${String(v ?? '').replaceAll('"', '""')}"`;

    const body = filtered.map((r, idx) =>
      [
        idx + 1,
        r.store,
        r.city,
        r.brand,
        r.product,
        r.tcin,
        r.quantity,
        r.status,
        r.availability,
        r.fetchedAt,
        r.error,
      ]
        .map(escape)
        .join(',')
    );

    const blob = new Blob([[header.join(','), ...body].join('\n')], {
      type: 'text/csv',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `target-inventory-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <header>
        <div>
          <div className="eyebrow">STORE-LEVEL INVENTORY ACTION</div>

          <h1>Target In-Stock Command Center</h1>

          <p>
            OOS first. API failures are never counted as zero on-hand.
          </p>
        </div>

        <button
          className="primary"
          onClick={refresh}
          disabled={busy}
        >
          {busy ? 'Refreshing…' : 'Refresh Target'}
        </button>
      </header>

      <section className="stats">
        <div className="stat danger">
          <strong>{counts.OOS}</strong>
          <span>Out of Stock</span>
        </div>

        <div className="stat warning">
          <strong>{counts.LOW}</strong>
          <span>Low (1–2)</span>
        </div>

        <div className="stat good">
          <strong>{counts.HEALTHY}</strong>
          <span>Healthy</span>
        </div>

        <div className="stat neutral">
          <strong>{counts.UNKNOWN}</strong>
          <span>Unknown / API</span>
        </div>
      </section>

      <section className="controls">
        <select
          value={storeFilter}
          onChange={(e) => setStoreFilter(e.target.value)}
        >
          <option value="ALL">All stores</option>

          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All statuses</option>
          <option value="OOS">OOS only</option>
          <option value="LOW">Low only</option>
          <option value="HEALTHY">Healthy only</option>
          <option value="UNKNOWN">Unknown/API only</option>
        </select>

        <button onClick={exportCsv}>Export</button>
      </section>

      <section className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Store</th>
              <th>Brand</th>
              <th>Item</th>
              <th>TCIN</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Target Availability</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.key}>
                <td>{idx + 1}</td>

                <td>
                  <b>{r.store}</b>
                  <small>{r.city}</small>
                </td>

                <td>{r.brand}</td>

                <td>{r.product}</td>

                <td className="mono">{r.tcin}</td>

                <td className="qty">{r.quantity ?? '—'}</td>

                <td>
                  <span className={`pill ${r.status.toLowerCase()}`}>
                    {r.status}
                  </span>
                </td>

                <td>
                  {r.availability}

                  {r.error && (
                    <small className="error">
                      {r.error}
                    </small>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer>
        Reported quantity is Target fulfillment data, not a guaranteed
        physical shelf count. Availability can change quickly.
      </footer>
    </main>
  );
}
