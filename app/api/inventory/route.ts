import { NextRequest, NextResponse } from 'next/server';
import { fetchTargetInventory } from '@/lib/target';

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;

  const tcin = p.get('tcin');
  const storeId = p.get('storeId');

  if (!tcin || !storeId) {
    return NextResponse.json(
      { error: 'TCIN and Target store ID are required.' },
      { status: 400 }
    );
  }

  const result = await fetchTargetInventory({
    tcin,
    storeId
  });

  return NextResponse.json(result);
}
