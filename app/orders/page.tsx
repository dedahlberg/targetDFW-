'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getWeekStart, OrderAddition, readOrderAdditions } from '@/lib/orderTracking';

export default function OrdersPage() {
  const [records, setRecords] = useState<OrderAddition[]>([]);

  useEffect(() => {
    setRecords(readOrderAdditions());
  }, []);

  const currentWeek = getWeekStart();
  const currentMonth = new Date().toISOString().slice(0, 7);

  const weeklyRows = useMemo(() => {
    const map = new Map<string, { weekStart: string; cases: number; stores: Set<string>; lines: number }>();

    for (const r of records) {
      const existing = map.get(r.weekStart) ?? {
        weekStart: r.weekStart,
        cases: 0,
        stores: new Set<string>(),
        lines: 0,
      };
      existing.cases += r.cases;
      existing.stores.add(r.storeId);
      existing.lines += 1;
      map.set(r.weekStart, existing);
    }

    return Array.from(map.values())
      .map((r) => ({ ...r, stores: r.stores.size }))
      .sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  }, [records]);

  const currentWeekRecords = useMemo(
    () => records.filter((r) => r.weekStart === currentWeek),
    [records, currentWeek]
  );

  const currentWeekCases = currentWeekRecords.reduce((sum, r) => sum + r.cases, 0);
  const currentMonthCases = records
    .filter((r) => r.weekStart.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.cases, 0);
  const currentWeekStores = new Set(currentWeekRecords.map((r) => r.storeId)).size;

  return (
    <main>
      <header>
        <div>
          <div className="eyebrow">ORDER ADDITION ANALYSIS</div>
          <h1>Target Case Additions</h1>
          <p>Track cases added to protect in-stock performance by week and month.</p>
        </div>
        <Link className="navButton" href="/">Back to Store Dashboard</Link>
      </header>

      <section className="stats orderStats">
        <div className="stat good">
          <strong>{currentWeekCases}</strong>
          <span>Cases Added This Week</span>
          <small>Week of {currentWeek}</small>
        </div>
        <div className="stat warning">
          <strong>{currentMonthCases}</strong>
          <span>Cases Added This Month</span>
          <small>{currentMonth}</small>
        </div>
        <div className="stat neutral">
          <strong>{currentWeekStores}</strong>
          <span>Stores With Adds</span>
          <small>This week</small>
        </div>
        <div className="stat neutral">
          <strong>{currentWeekRecords.length}</strong>
          <span>Item Adds</span>
          <small>This week</small>
        </div>
      </section>

      <section className="analysisSection">
        <div className="sectionTitle">
          <div>
            <h2>Current Week Detail</h2>
            <p>Every item with cases added for the current sales week.</p>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Store</th><th>City</th><th>Brand</th><th>Item</th><th>TCIN</th><th>Cases Added</th><th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {currentWeekRecords.length === 0 ? (
                <tr><td colSpan={7}>No case additions recorded for this week yet.</td></tr>
              ) : (
                [...currentWeekRecords]
                  .sort((a, b) => b.cases - a.cases || a.storeName.localeCompare(b.storeName))
                  .map((r) => (
                    <tr key={r.id}>
                      <td>{r.storeName}</td>
                      <td>{r.city}</td>
                      <td>{r.brand}</td>
                      <td>{r.product}</td>
                      <td className="mono">{r.tcin}</td>
                      <td className="qty">{r.cases}</td>
                      <td>{new Date(r.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="analysisSection">
        <div className="sectionTitle">
          <div>
            <h2>Weekly Trend</h2>
            <p>Cases added across each tracked sales week.</p>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr><th>Week Starting</th><th>Cases Added</th><th>Stores</th><th>Item Adds</th></tr>
            </thead>
            <tbody>
              {weeklyRows.length === 0 ? (
                <tr><td colSpan={4}>No weekly history yet.</td></tr>
              ) : weeklyRows.map((r) => (
                <tr key={r.weekStart}>
                  <td>{r.weekStart}</td>
                  <td className="qty">{r.cases}</td>
                  <td>{r.stores}</td>
                  <td>{r.lines}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer>Case additions are saved in this browser for now. A shared cloud database can be added later so multiple users and devices contribute to one history.</footer>
    </main>
  );
}
