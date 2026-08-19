import { NextRequest, NextResponse } from 'next/server';
import { fetchTargetInventory } from '@/lib/target';

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const tcin = p.get('tcin');
  const storeId = p.get('storeId');
  const zip = p.get('zip');
  const state = p.get('state');
  const latitude = Number(p.get('latitude'));
  const longitude = Number(p.get('longitude'));

  if (!tcin || !storeId || !zip || !state || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: 'Missing or invalid inventory query parameters.' }, { status: 400 });
  }

  const result = await fetchTargetInventory({ tcin, storeId, zip, state, latitude, longitude });
  return NextResponse.json(result, { status: result.status === 'UNKNOWN' ? 502 : 200 });
}
