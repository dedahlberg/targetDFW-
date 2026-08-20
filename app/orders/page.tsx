'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getWeekStart, OrderAddition, readOrderAdditions, writeOrderAdditions } from '@/lib/orderTracking';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function OrdersPage() {
  const [records, setRecords] = useState<OrderAddition[]>([]);
  useEffect(() => { setRecords(readOrderAdditions()); }, []);
  const currentWeek = getWeekStart();
  const currentMonth = new Date().toISOString().slice(0, 7);
  const weeklyRows = useMemo(() => {
    const map = new Map<string, { weekStart: string; cases: number; dollars: number; stores: Set<string>; lines: number }>();
    for (const r of records) { const existing = map.get(r.weekStart) ?? { weekStart:r.weekStart,cases:0,dollars:0,stores:new Set<string>(),lines:0 }; existing.cases += r.cases; existing.dollars += r.addedValue ?? 0; existing.stores.add(r.storeId); existing.lines += 1; map.set(r.weekStart, existing); }
    return Array.from(map.values()).map(r => ({ ...r, stores:r.stores.size })).sort((a,b)=>b.weekStart.localeCompare(a.weekStart));
  }, [records]);
  const currentWeekRecords = useMemo(() => records.filter(r=>r.weekStart===currentWeek), [records,currentWeek]);
  const currentMonthRecords = useMemo(() => records.filter(r=>r.weekStart.startsWith(currentMonth)), [records,currentMonth]);
  const currentWeekCases=currentWeekRecords.reduce((s,r)=>s+r.cases,0), currentMonthCases=currentMonthRecords.reduce((s,r)=>s+r.cases,0), currentWeekDollars=currentWeekRecords.reduce((s,r)=>s+(r.addedValue??0),0), currentMonthDollars=currentMonthRecords.reduce((s,r)=>s+(r.addedValue??0),0), currentWeekStores=new Set(currentWeekRecords.map(r=>r.storeId)).size, missingPriceLines=currentWeekRecords.filter(r=>r.casePrice===undefined).length;
  function deleteLineItem(id:string){const next=records.filter(r=>r.id!==id);writeOrderAdditions(next);setRecords(next)}

  return <main id="top">
    <header><div><div className="eyebrow">ORDER ADDITION ANALYSIS</div><h1>Target Case Additions</h1><p>Track cases and incremental dollars added to protect Target in-stock performance.</p></div><Link className="navButton" href="/">Back to Store Dashboard</Link></header>
    <section className="stats orderStats"><div className="stat good"><strong>{currentWeekCases}</strong><span>Cases Added This Week</span><small>Week of {currentWeek}</small></div><div className="stat good"><strong>{money.format(currentWeekDollars)}</strong><span>Dollars Added This Week</span><small>Known case prices</small></div><div className="stat warning"><strong>{currentMonthCases}</strong><span>Cases Added This Month</span><small>{currentMonth}</small></div><div className="stat warning"><strong>{money.format(currentMonthDollars)}</strong><span>Dollars Added This Month</span><small>{currentMonth}</small></div><div className="stat neutral"><strong>{currentWeekStores}</strong><span>Stores With Adds</span><small>This week</small></div><div className="stat neutral"><strong>{missingPriceLines}</strong><span>Adds Missing Price</span><small>Current week</small></div></section>
    <section className="analysisSection"><div className="sectionTitle"><div><h2>Current Week Detail</h2><p>Every item with cases added for the current sales week.</p></div></div><div className="tableWrap"><table><thead><tr><th>Store</th><th>City</th><th>Brand</th><th>Item</th><th>TCIN</th><th>Cases Added</th><th>Case Price</th><th>Added $</th><th>Delete Line Item</th><th>Updated</th></tr></thead><tbody>{currentWeekRecords.length===0?<tr><td colSpan={10}>No case additions recorded for this week yet.</td></tr>:[...currentWeekRecords].sort((a,b)=>(b.addedValue??0)-(a.addedValue??0)||b.cases-a.cases||a.storeName.localeCompare(b.storeName)).map(r=><tr key={r.id}><td>{r.storeName}</td><td>{r.city}</td><td>{r.brand}</td><td>{r.product}</td><td className="mono">{r.tcin}</td><td className="qty">{r.cases}</td><td>{r.casePrice!==undefined?money.format(r.casePrice):<span className="missingPrice">Missing</span>}</td><td className="moneyCell">{r.addedValue!==undefined?money.format(r.addedValue):'—'}</td><td><button type="button" onClick={()=>deleteLineItem(r.id)}>Delete</button></td><td>{new Date(r.updatedAt).toLocaleString()}</td></tr>)}</tbody></table></div></section>
    <section className="analysisSection"><div className="sectionTitle"><div><h2>Weekly Trend</h2><p>Cases and dollar value added across each tracked sales week.</p></div></div><div className="tableWrap"><table><thead><tr><th>Week Starting</th><th>Cases Added</th><th>Added $</th><th>Stores</th><th>Item Adds</th></tr></thead><tbody>{weeklyRows.length===0?<tr><td colSpan={5}>No weekly history yet.</td></tr>:weeklyRows.map(r=><tr key={r.weekStart}><td>{r.weekStart}</td><td className="qty">{r.cases}</td><td className="moneyCell">{money.format(r.dollars)}</td><td>{r.stores}</td><td>{r.lines}</td></tr>)}</tbody></table></div></section>
    <nav className="mobileBottomNav"><Link href="/">Store</Link><Link href="/regions">Regions</Link><Link href="/?view=attention"><span>+</span>Act</Link><a href="#top" className="active">Orders</a><Link href="/">Refresh</Link></nav>
    <footer>Dollar totals use the discounted case price saved when the case addition is entered. Items without a loaded case price are clearly marked and excluded from dollar totals.</footer>
  </main>;
}
