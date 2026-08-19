export type InventoryResult = {
  tcin: string;
  storeId: string;
  quantity: number | null;
  status: 'OOS' | 'LOW' | 'HEALTHY' | 'UNKNOWN';
  availability: string;
  source: 'TARGET_PDP';
  fetchedAt: string;
  error?: string;
};

type Input = {
  tcin: string;
  storeId: string;
};

type StoreContext = {
  zip?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
};

function numeric(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);

    if (Number.isFinite(n)) {
      return n;
    }
  }

  return null;
}

function classify(
  quantity: number | null,
  availability: string
): InventoryResult['status'] {
  const value = String(availability || '').toUpperCase();

  if (quantity !== null) {
    if (quantity <= 0) return 'OOS';
    if (quantity <= 2) return 'LOW';
    return 'HEALTHY';
  }

  if (
    value.includes('OUT_OF_STOCK') ||
    value.includes('OUT OF STOCK') ||
    value.includes('NOT_AVAILABLE') ||
    value.includes('NOT AVAILABLE') ||
    value.includes('UNAVAILABLE')
  ) {
    return 'OOS';
  }

  return 'UNKNOWN';
}

function getStoreId(obj: any): string {
  return String(
    obj?.store_id ??
      obj?.location_id ??
      obj?.storeId ??
      obj?.locationId ??
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
    obj?.inventory_quantity,
    obj?.on_hand_quantity,
    obj?.quantity,
    obj?.available_to_promise_qty,
    obj?.atp_quantity,
    obj?.pickup_quantity,
  ];

  for (const candidate of candidates) {
    const n = numeric(candidate);

    if (n !== null) {
      return n;
    }
  }

  return null;
}

function getAvailability(obj: any): string {
  const candidates = [
    obj?.order_pickup?.availability_status,
    obj?.pickup?.availability_status,
    obj?.pickup?.status,
    obj?.in_store_only?.availability_status,
    obj?.availability_status,
    obj?.fulfillment?.availability_status,
    obj?.availability,
    obj?.status,
  ];

  for (const candidate of candidates) {
    if (
      typeof candidate === 'string' &&
      candidate.trim() !== ''
    ) {
      return candidate;
    }
  }

  return 'UNKNOWN';
}

function searchInventory(
  node: any,
  storeId: string
): {
  quantity: number | null;
  availability: string;
} | null {
  if (!node || typeof node !== 'object') {
    return null;
  }

  if (Array.isArray(node)) {
    const exactStore = node.find(
      (item) => getStoreId(item) === String(storeId)
    );

    if (exactStore) {
      const quantity = getQuantity(exactStore);
      const availability = getAvailability(exactStore);

      if (
        quantity !== null ||
        availability !== 'UNKNOWN'
      ) {
        return {
          quantity,
          availability,
        };
      }
    }

    for (const item of node) {
      const result = searchInventory(item, storeId);

      if (result) {
        return result;
      }
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
    return {
      quantity,
      availability,
    };
  }

  for (const value of Object.values(node)) {
    const result = searchInventory(value, storeId);

    if (result) {
      return result;
    }
  }

  return null;
}

function searchGeneralInventory(
  node: any
): {
  quantity: number | null;
  availability: string;
} | null {
  if (!node || typeof node !== 'object') {
    return null;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const result = searchGeneralInventory(item);

      if (result) {
        return result;
      }
    }

    return null;
  }

  const quantity = getQuantity(node);
  const availability = getAvailability(node);

  if (
    quantity !== null ||
    availability !== 'UNKNOWN'
  ) {
    return {
      quantity,
      availability,
    };
  }

  for (const value of Object.values(node)) {
    const result = searchGeneralInventory(value);

    if (result) {
      return result;
    }
  }

  return null;
}

function findStringByKeys(
  node: any,
  keys: string[]
): string | undefined {
  if (!node || typeof node !== 'object') {
    return undefined;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const result = findStringByKeys(item, keys);

      if (result) return result;
    }

    return undefined;
  }

  for (const key of keys) {
    const value = node[key];

    if (
      typeof value === 'string' &&
      value.trim() !== ''
    ) {
      return value;
    }
  }

  for (const value of Object.values(node)) {
    const result = findStringByKeys(value, keys);

    if (result) return result;
  }

  return undefined;
}

function findNumberByKeys(
  node: any,
  keys: string[]
): number | undefined {
  if (!node || typeof node !== 'object') {
    return undefined;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      const result = findNumberByKeys(item, keys);

      if (result !== undefined) return result;
    }

    return undefined;
  }

  for (const key of keys) {
    const value = numeric(node[key]);

    if (value !== null) {
      return value;
    }
  }

  for (const value of Object.values(node)) {
    const result = findNumberByKeys(value, keys);

    if (result !== undefined) return result;
  }

  return undefined;
}

function makeVisitorId(): string {
  const randomPart = crypto.randomUUID().replaceAll('-', '').toUpperCase();

  return randomPart.slice(0, 32);
}

async function getStoreContext(
  storeId: string,
  key: string
): Promise<StoreContext> {
  const params = new URLSearchParams({
    store_id: storeId,
    key,
  });

  const urls = [
    `https://redsky.target.com/redsky_aggregations/v1/web/store_location_v1?${params.toString()}`,
    `https://www.target.com/redsky_aggregations/v1/web/store_location_v1?${params.toString()}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
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

      if (!response.ok) {
        continue;
      }

      const data = await response.json();

      const zip = findStringByKeys(data, [
        'postal_code',
        'zip',
        'zip_code',
      ]);

      const state = findStringByKeys(data, [
        'region',
        'state',
        'state_code',
      ]);

      const latitude = findNumberByKeys(data, [
        'latitude',
        'lat',
      ]);

      const longitude = findNumberByKeys(data, [
        'longitude',
        'lng',
        'lon',
      ]);

      const timezone =
        findStringByKeys(data, [
          'timezone',
          'time_zone',
        ]) ?? 'America/Chicago';

      if (
        zip &&
        state &&
        latitude !== undefined &&
        longitude !== undefined
      ) {
        return {
          zip,
          state,
          latitude,
          longitude,
          timezone,
        };
      }
    } catch {
      // Try next endpoint.
    }
  }

  return {
    timezone: 'America/Chicago',
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
      source: 'TARGET_PDP',
      fetchedAt,
      error: 'TARGET_REDSKY_KEY is not configured.',
    };
  }

  try {
    const store = await getStoreContext(
      input.storeId,
      key
    );

    if (
      !store.zip ||
      !store.state ||
      store.latitude === undefined ||
      store.longitude === undefined
    ) {
      return {
        tcin: input.tcin,
        storeId: input.storeId,
        quantity: null,
        status: 'UNKNOWN',
        availability: 'STORE_LOCATION_ERROR',
        source: 'TARGET_PDP',
        fetchedAt,
        error:
          'Could not resolve Target store ZIP/coordinates for this store.',
      };
    }

    const visitorId = makeVisitorId();

    const params = new URLSearchParams({
      auth: 'true',

      purchasable_store_ids:
        input.storeId,

      latitude:
        String(store.latitude),

      longitude:
        String(store.longitude),

      scheduled_delivery_store_id:
        input.storeId,

      scheduled_delivery_zip_code:
        store.zip,

      state:
        store.state,

      zip:
        store.zip,

      store_id:
        input.storeId,

      tcin:
        input.tcin,

      timezone:
        store.timezone ?? 'America/Chicago',

      country:
        'US',

      sapphire_channel:
        'WEB',

      sapphire_page:
        `/p/-/A-${input.tcin}`,

      channel:
        'WEB',

      page:
        `/p/-/A-${input.tcin}`,

      visitor_id:
        visitorId,

      privacy_do_not_sell:
        'false',

      targeted_advertising_opt_out:
        'false',

      device_type:
        'desktop',

      key,
    });

    const url =
      `https://www.target.com` +
      `/cdui_orchestrations/v1/pages/pdp/deferred_enrichment/modules` +
      `?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',

      headers: {
        accept:
          'application/json, text/plain, */*',

        'accept-language':
          'en-US,en;q=0.9',

        origin:
          'https://www.target.com',

        referer:
          `https://www.target.com/p/-/A-${input.tcin}`,

        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
      },

      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();

      return {
        tcin: input.tcin,
        storeId: input.storeId,
        quantity: null,
        status: 'UNKNOWN',
        availability: 'API_ERROR',
        source: 'TARGET_PDP',
        fetchedAt,
        error:
          `Target PDP enrichment returned HTTP ${response.status}` +
          (text ? `: ${text.slice(0, 200)}` : ''),
      };
    }

    const payload = await response.json();

    const exact =
      searchInventory(
        payload,
        input.storeId
      );

    const fallback =
      exact ??
      searchGeneralInventory(payload);

    if (!fallback) {
      return {
        tcin: input.tcin,
        storeId: input.storeId,
        quantity: null,
        status: 'UNKNOWN',
        availability:
          'NO_INVENTORY_DATA',
        source: 'TARGET_PDP',
        fetchedAt,
        error:
          'Target accepted the request, but the returned JSON did not contain a recognized quantity or availability field.',
      };
    }

    return {
      tcin:
        input.tcin,

      storeId:
        input.storeId,

      quantity:
        fallback.quantity,

      status:
        classify(
          fallback.quantity,
          fallback.availability
        ),

      availability:
        fallback.availability,

      source:
        'TARGET_PDP',

      fetchedAt,
    };
  } catch (error) {
    return {
      tcin: input.tcin,
      storeId: input.storeId,
      quantity: null,
      status: 'UNKNOWN',
      availability: 'API_ERROR',
      source: 'TARGET_PDP',
      fetchedAt,

      error:
        error instanceof Error
          ? error.message
          : 'Unknown Target PDP request error.',
    };
  }
}
