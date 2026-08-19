export type InventoryResult = {
  tcin: string;
  storeId: string;
  quantity: number | null;
  status: 'OOS' | 'LOW' | 'HEALTHY' | 'UNKNOWN';
  availability: string;
  source: 'TARGET_REDSKY';
  fetchedAt: string;
  error?: string;
};

type Input = {
  tcin: string;
  storeId: string;
  zip: string;
  state: string;
  latitude: number;
  longitude: number;
};

function classify(quantity: number | null, availability: string): InventoryResult['status'] {
  if (quantity === null) return availability === 'OUT_OF_STOCK' ? 'OOS' : 'UNKNOWN';
  if (quantity <= 0) return 'OOS';
  if (quantity <= 2) return 'LOW';
  return 'HEALTHY';
}

function findInventory(payload: any, storeId: string): { quantity: number | null; availability: string } {
  const fulfillment = payload?.data?.product?.fulfillment;
  const locations = fulfillment?.store_options ?? fulfillment?.locations ?? [];

  if (Array.isArray(locations)) {
    const selected = locations.find((x: any) => String(x?.location_id ?? x?.store?.store_id ?? x?.store_id ?? '') === String(storeId)) ?? locations[0];
    if (selected) {
      const q = selected.location_available_to_promise_quantity ?? selected.available_to_promise_quantity ?? null;
      const availability = selected?.order_pickup?.availability_status ?? selected?.in_store_only?.availability_status ?? selected?.availability_status ?? 'UNKNOWN';
      return { quantity: typeof q === 'number' ? q : q == null ? null : Number(q), availability };
    }
  }

  const quantity = fulfillment?.available_to_promise_quantity ?? null;
  const availability = fulfillment?.availability_status ?? 'UNKNOWN';
  return { quantity: typeof quantity === 'number' ? quantity : quantity == null ? null : Number(quantity), availability };
}

export async function fetchTargetInventory(input: Input): Promise<InventoryResult> {
  const key = process.env.TARGET_REDSKY_KEY;
  const fetchedAt = new Date().toISOString();

  if (!key) {
    return {
      tcin: input.tcin,
      storeId: input.storeId,
      quantity: null,
      status: 'UNKNOWN',
      availability: 'CONFIG_REQUIRED',
      source: 'TARGET_REDSKY',
      fetchedAt,
      error: 'TARGET_REDSKY_KEY is not configured.'
    };
  }

  const params = new URLSearchParams({
    key,
    is_bot: 'false',
    tcin: input.tcin,
    store_id: input.storeId,
    pricing_store_id: input.storeId,
    store_positions_store_id: input.storeId,
    has_store_positions_store_id: 'true',
    has_pricing_store_id: 'true',
    required_store_id: input.storeId,
    has_required_store_id: 'true',
    scheduled_delivery_store_id: input.storeId,
    zip: input.zip,
    state: input.state,
    latitude: String(input.latitude),
    longitude: String(input.longitude)
  });

  const candidates = [
    `https://redsky.target.com/redsky_aggregations/v1/web_platform/product_fulfillment_v1?${params}`,
    `https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?${params}`
  ];

  let lastError = 'Target inventory request failed.';
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        headers: { 'accept': 'application/json', 'user-agent': 'Mozilla/5.0 TargetInventoryCommandCenter/0.1' },
        cache: 'no-store'
      });
      if (!res.ok) {
        lastError = `Target returned HTTP ${res.status}`;
        continue;
      }
      const payload = await res.json();
      const parsed = findInventory(payload, input.storeId);
      return {
        tcin: input.tcin,
        storeId: input.storeId,
        quantity: parsed.quantity,
        status: classify(parsed.quantity, parsed.availability),
        availability: parsed.availability,
        source: 'TARGET_REDSKY',
        fetchedAt
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown Target request error';
    }
  }

  return {
    tcin: input.tcin,
    storeId: input.storeId,
    quantity: null,
    status: 'UNKNOWN',
    availability: 'API_ERROR',
    source: 'TARGET_REDSKY',
    fetchedAt,
    error: lastError
  };
}
