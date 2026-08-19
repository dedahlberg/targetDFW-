import { stores } from '@/data/stores';

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

type TargetModule = {
  module_placement_id: string;
  module_type: string;
  enrichment_context: string;
};

const TEMPLATE_TCin = '13376389';

const TEMPLATE_PAGE_CONTEXT =
  'eyJwbGF0Zm9ybSI6eyJDTElFTlRfVkVSU0lPTiI6e30sIlNBUFBISVJFX0lOUFVUUyI6eyJ2aXNpdG9yX2lkIjoiMDAwMDAwMDAwMzMwMDEwMTcyRDJCMUM0N0QzMTI4Q0UiLCJzYXBwaGlyZV9wYWdlIjoiL3AvQS0xMzM3NjM4OSIsInNhcHBoaXJlX2NoYW5uZWwiOiJXRUIifSwiVklTSVRPUl9JRCI6eyJ2aXNpdG9yX2lkIjoiMDAwMDAwMDAwMzMwMDEwMTcyRDJCMUM0N0QzMTI4Q0UifSwiUEFHRV9UWVBFIjp7InJlZG9ha19wYWdlX3R5cGUiOiJQRFAifX0sIm1vZHVsZSI6eyJQTEFURk9STSI6eyJwbGF0Zm9ybSI6IldFQiJ9LCJJU19BTk9OWU1PVVMiOnsiaXNfYW5vbnltb3VzIjp0cnVlfSwiRklORFNfUE9TVFNfUFJPRFVDVF9JTlBVVFMiOnsiaW5jbHVkZV9maW5kc19sb25nX2Zvcm1fdmlkZW9zIjp0cnVlLCJpbmNsdWRlX2ZpbmRzX3Nob3J0X2Zvcm1fdmlkZW9zIjp0cnVlfSwiSVNfU0VPX0JPVCI6eyJpc19zZW9fYm90IjpmYWxzZX0sIlRDSU4iOnsidGNpbiI6IjEzMzc2Mzg5In0sIlNFTEVDVEVEX0NISUxEX1RDSU4iOnsic2VsZWN0ZWRfY2hpbGRfdGNpbiI6IjEzMzc2Mzg5In0sIlJFQ09NTUVOREVEX1RDSU5TIjp7InJlY29tbWVuZGVkX3RjaW5zIjpbIjEzMzc2Mzg5Il19LCJQUklDSU5HX0NPTlRFWFQiOnsicHJpY2luZ19jb250ZXh0IjoiZGlnaXRhbCJ9LCJQUklWQUNZX0RPX05PVF9TRUxMIjp7InByaXZhY3lfZG9fbm90X3NlbGwiOmZhbHNlfSwiUkFUSU5HU19SRVZJRVdTX0lOUFVUUyI6eyJyYXRpbmdzX3Jldmlld3NfaW5jbHVkZXMiOlsicmV2aWV3cyIsInJldmlld3NXaXRoTWVkaWEiLCJtZWRpYVRodW1ibmFpbHMiLCJlbnRpdGllcyIsIm1ldGFkYXRhIiwic3RhdGlzdGljcyJdLCJyYXRpbmdzX3Jldmlld3NfcmV2aWV3X3R5cGUiOiJQUk9EVUNUIiwicmF0aW5nc19yZXZpZXdzX3BhZ2UiOjAsInJhdGluZ3NfcmV2aWV3c19zaXplIjo4LCJyYXRpbmdzX3Jldmlld3Nfc29ydF9ieSI6Im1vc3RfcmVjZW50IiwicmF0aW5nc19yZXZpZXdzX2hhc19vbmx5X3Bob3RvcyI6ZmFsc2UsInJhdGluZ3NfcmV2aWV3c19oYXNfb25seV92aWRlb3MiOmZhbHNlLCJyYXRpbmdzX3Jldmlld3NfdmVyaWZpZWRfb25seSI6ZmFsc2V9LCJUQVJHRVRFRF9BRFZFUlRJU0lOR19PUFRfT1VUIjp7InRhcmdldGVkX2FkdmVydGlzaW5nX29wdF9vdXQiOmZhbHNlfSwiQ0FURUdPUllfSUQiOnsiY2F0ZWdvcnlfaWQiOiI1eHN6NCJ9LCJSQURFVVNfUEFHRV9CUkVBRENSVU1CIjp7InJhZGV1c19wYWdlX2JyZWFkY3J1bWIiOlsicm9vdCIsIjV4dDFhIiwiNXhzemQiLCI1eHN6NCJdfX0sIm1vZHVsZV9lbnJpY2htZW50X2NvbnRleHRzIjpbeyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZUNpcmNsZU9mZmVycyJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlQ2lyY2xlT2ZmZXJzIn0seyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZUZ1bGZpbGxtZW50QW5kVmFyaWF0aW9ucyJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlRnVsZmlsbG1lbnRBbmRWYXJpYXRpb25zIn0seyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZVBlcnNvbmFsaXplZCJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlUGVyc29uYWxpemVkIn0seyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZVdpdGhTdG9yZSJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlV2l0aFN0b3JlIn1dfQ==';

const TEMPLATE_MODULES: TargetModule[] = [
  {
    module_placement_id: 'ffbd6186-b9f5-4380-81d1-77a6758195f8',
    module_type: 'ProductDetailLastPurchasedInfo',
    enrichment_context:
      'eyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiUHJvZHVjdERldGFpbEFib3ZlVGhlRm9sZE1vYmlsZSIsIm1vZHVsZV9ncm91cF9pZCI6IlByb2R1Y3REZXRhaWxBYm92ZVRoZUZvbGRNb2JpbGUiLCJtb2R1bGVfcGxhY2VtZW50X2lkIjoiZmZiZDYxODYtYjlmNS00MzgwLTgxZDEtNzdhNjc1ODE5NWY4In0sInVwZGF0ZXNfb25fYWN0aW9ucyI6WyJ2YXJpYXRpb25fY2hpbGRfc3dpdGNoIl0sIm1vZHVsZV90eXBlIjoiUHJvZHVjdERldGFpbExhc3RQdXJjaGFzZWRJbmZvIiwibW9kdWxlX2NvbmZpZ19zY2hlbWFfdmVyc2lvbiI6MH0=',
  },
];

function numeric(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  return null;
}

function classify(
  quantity: number | null,
  availability: string
): InventoryResult['status'] {
  const value = availability.toUpperCase();

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
    if (n !== null) return n;
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
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate;
    }
  }

  return 'UNKNOWN';
}

function searchInventory(
  node: any,
  storeId: string
): { quantity: number | null; availability: string } | null {
  if (!node || typeof node !== 'object') return null;

  if (Array.isArray(node)) {
    for (const item of node) {
      if (getStoreId(item) === String(storeId)) {
        const quantity = getQuantity(item);
        const availability = getAvailability(item);

        if (quantity !== null || availability !== 'UNKNOWN') {
          return { quantity, availability };
        }
      }
    }

    for (const item of node) {
      const result = searchInventory(item, storeId);
      if (result) return result;
    }

    return null;
  }

  if (getStoreId(node) === String(storeId)) {
    const quantity = getQuantity(node);
    const availability = getAvailability(node);

    if (quantity !== null || availability !== 'UNKNOWN') {
      return { quantity, availability };
    }
  }

  for (const value of Object.values(node)) {
    const result = searchInventory(value, storeId);
    if (result) return result;
  }

  return null;
}

function searchGeneralInventory(
  node: any
): { quantity: number | null; availability: string } | null {
  if (!node || typeof node !== 'object') return null;

  if (Array.isArray(node)) {
    for (const item of node) {
      const result = searchGeneralInventory(item);
      if (result) return result;
    }

    return null;
  }

  const quantity = getQuantity(node);
  const availability = getAvailability(node);

  if (quantity !== null || availability !== 'UNKNOWN') {
    return { quantity, availability };
  }

  for (const value of Object.values(node)) {
    const result = searchGeneralInventory(value);
    if (result) return result;
  }

  return null;
}

function replaceTcinInPageContext(
  pageContext: string,
  tcin: string,
  visitorId: string
): string {
  const decoded = Buffer.from(pageContext, 'base64').toString('utf8');

  const updated = decoded
    .replaceAll(TEMPLATE_TCin, tcin)
    .replaceAll(
      '000000000330010172D2B1C47D3128CE',
      visitorId
    );

  return Buffer.from(updated, 'utf8').toString('base64');
}

function makeVisitorId(): string {
  return crypto.randomUUID().replaceAll('-', '').toUpperCase().slice(0, 32);
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

  const store = stores.find((s) => s.id === input.storeId);

  if (!store) {
    return {
      tcin: input.tcin,
      storeId: input.storeId,
      quantity: null,
      status: 'UNKNOWN',
      availability: 'STORE_NOT_FOUND',
      source: 'TARGET_PDP',
      fetchedAt,
      error: `Store ${input.storeId} was not found in data/stores.ts.`,
    };
  }

  if (
    !store.zip ||
    store.latitude === undefined ||
    store.longitude === undefined
  ) {
    return {
      tcin: input.tcin,
      storeId: input.storeId,
      quantity: null,
      status: 'UNKNOWN',
      availability: 'STORE_LOCATION_MISSING',
      source: 'TARGET_PDP',
      fetchedAt,
      error:
        `Store ${input.storeId} is missing ZIP/latitude/longitude in data/stores.ts.`,
    };
  }

  try {
    const visitorId = makeVisitorId();

    const pageContext = replaceTcinInPageContext(
      TEMPLATE_PAGE_CONTEXT,
      input.tcin,
      visitorId
    );

    const requestBody = {
      page_context: pageContext,
      modules: TEMPLATE_MODULES,
    };

    const params = new URLSearchParams({
      auth: 'true',
      purchasable_store_ids: input.storeId,
      latitude: String(store.latitude),
      longitude: String(store.longitude),
      scheduled_delivery_store_id: input.storeId,
      scheduled_delivery_zip_code: store.zip,
      state: store.state,
      zip: store.zip,
      store_id: input.storeId,
      tcin: input.tcin,
      timezone: store.timezone ?? 'America/Chicago',
      country: 'US',
      sapphire_channel: 'WEB',
      sapphire_page: `/p/-/A-${input.tcin}`,
      channel: 'WEB',
      page: `/p/-/A-${input.tcin}`,
      visitor_id: visitorId,
      privacy_do_not_sell: 'false',
      targeted_advertising_opt_out: 'false',
      device_type: 'desktop',
      key,
    });

    const url =
      `https://www.target.com` +
      `/cdui_orchestrations/v1/pages/pdp/deferred_enrichment/modules` +
      `?${params.toString()}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        origin: 'https://www.target.com',
        referer: `https://www.target.com/p/-/A-${input.tcin}`,
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
      },
      body: JSON.stringify(requestBody),
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
          (text ? `: ${text.slice(0, 300)}` : ''),
      };
    }

    const payload = await response.json();

    const exact = searchInventory(payload, input.storeId);
    const fallback = exact ?? searchGeneralInventory(payload);

    if (!fallback) {
      return {
        tcin: input.tcin,
        storeId: input.storeId,
        quantity: null,
        status: 'UNKNOWN',
        availability: 'NO_INVENTORY_DATA',
        source: 'TARGET_PDP',
        fetchedAt,
        error:
          'Target accepted the request, but no recognized inventory fields were found in the response.',
      };
    }

    return {
      tcin: input.tcin,
      storeId: input.storeId,
      quantity: fallback.quantity,
      status: classify(
        fallback.quantity,
        fallback.availability
      ),
      availability: fallback.availability,
      source: 'TARGET_PDP',
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
