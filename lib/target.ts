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
};

function classify(
  quantity: number | null,
  availability: string
): InventoryResult['status'] {
  const a = String(availability || '').toUpperCase();

  if (quantity !== null && Number.isFinite(quantity)) {
    if (quantity <= 0) return 'OOS';
    if (quantity <= 2) return 'LOW';
    return 'HEALTHY';
  }

  if (
    a.includes('OUT_OF_STOCK') ||
    a.includes('NOT_AVAILABLE') ||
    a === 'UNAVAILABLE'
  ) {
    return 'OOS';
  }

  return 'UNKNOWN';
}

function numeric(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }

  return null;
}

function getStoreId(obj: any): string {
  return String(
    obj?.location_id ??
      obj?.store_id ??
      obj?.store?.store_id ??
      obj?.store?.location_id ??
      obj?.location?.location_id ??
      ''
  );
}

function getQuantity(obj: any): number | null {
  const candidates = [
    obj?.location_available_to_promise_quantity,
    obj?.available_to_promise_quantity,
    obj?.available_quantity,
    obj?.quantity,
    obj?.inventory_quantity,
    obj?.on_hand_quantity,
  ];

  for (const candidate of candidates) {
    const n = numeric(candidate);
    if (n !== null) return n;
  }

  return null;
}

function getAvailability(obj: any): string {
  return String(
    obj?.order_pickup?.availability_status ??
      obj?.pickup?.availability_status ??
      obj?.in_store_only?.availability_status ??
      obj?.availability_status ??
      obj?.fulfillment?.availability_status ??
      obj?.status ??
      'UNKNOWN'
  );
}

function searchPayload(
  node: any,
  storeId: string
): { quantity: number | null; availability: string } | null {
  if (!node || typeof node !== 'object') return null;

  if (Array.isArray(node)) {
    const exact = node.find((item) => getStoreId(item) === String(storeId));

    if (exact) {
      const quantity = getQuantity(exact);
      const availability = getAvailability(exact);

      if (quantity !== null || availability !== 'UNKNOWN') {
        return { quantity, availability };
      }
    }

    for (const item of node) {
      const result = searchPayload(item, storeId);
      if (result) return result;
    }

    return null;
  }

  const nodeStoreId = getStoreId(node);
  const quantity = getQuantity(node);
  const availability = getAvailability(node);

  if (
    nodeStoreId === String(storeId) &&
    (quantity !== null || availability !== 'UNKNOWN')
  ) {
    return { quantity, availability };
  }

  for (const value of Object.values(node)) {
    const result = searchPayload(value, storeId);
    if (result) return result;
  }

  return null;
}

function findInventory(
  payload: any,
  storeId: string
): { quantity: number | null; availability: string } {
  const fulfillment =
    payload?.data?.product?.fulfillment ??
    payload?.data?.product?.fulfillment_options ??
    payload?.data?.fulfillment;

  const knownLocations =
    fulfillment?.store_options ??
    fulfillment?.locations ??
    fulfillment?.pickup_options ??
    [];

  if (Array.isArray(knownLocations)) {
    const selected =
      knownLocations.find(
        (x: any) => getStoreId(x) === String(storeId)
      ) ?? knownLocations[0];

    if (selected) {
      return {
        quantity: getQuantity(selected),
        availability: getAvailability(selected),
      };
    }
  }

  const recursive = searchPayload(payload, storeId);

  if (recursive) return recursive;

  return {
    quantity: getQuantity(fulfillment),
    availability: getAvailability(fulfillment),
  };
}

export async function fetchTargetInventory(
  input: Input
): Promise<InventoryResult> {
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
      error: 'TARGET_REDSKY_KEY is not configured.',
    };
  }

  const baseParams = {
    key,
    channel: 'WEB',
    tcin: input.tcin,
    store_id: input.storeId,
    pricing_store_id: input.storeId,
    scheduled_delivery_store_id: input.storeId,
    required_store_id: input.storeId,
  };

  const endpointPaths = [
    '/redsky_aggregations/v1/web/product_fulfillment_v1',
    '/redsky_aggregations/v1/web/product_fulfillment_and_variation_hierarchy_v1',
    '/redsky_aggregations/v1/web_platform/product_fulfillment_v1',
    '/redsky_aggregations/v1/web/pdp_fulfillment_v1',
  ];

  let lastError = 'Target inventory request failed.';
  const attempted: string[] = [];

  for (const path of endpointPaths) {
    const params = new URLSearchParams(baseParams);
    const url = `https://redsky.target.com${path}?${params.toString()}`;

    attempted.push(path);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          origin: 'https://www.target.com',
          referer: 'https://www.target.com/',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        lastError = `${path} returned HTTP ${res.status}`;
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
        fetchedAt,
      };
    } catch (error) {
      lastError =
        error instanceof Error
          ? `${path}: ${error.message}`
          : `${path}: Unknown Target request error`;
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
    error: `${lastError}. Tried: ${attempted.join(', ')}`,
  };
}
