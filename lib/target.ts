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

type ModuleContext = {
  module_hierarchy?: {
    layout_id?: string;
    zone_id?: string;
    module_group_id?: string;
    module_placement_id?: string;
  };
  updates_on_actions?: string[];
  module_type?: string;
  module_config?: unknown;
  module_config_schema_version?: number;
};

const TEMPLATE_TCIN = '13376389';
const TEMPLATE_VISITOR_ID = '000000000330010172D2B1C47D3128CE';

const TEMPLATE_PAGE_CONTEXT =
  'eyJwbGF0Zm9ybSI6eyJDTElFTlRfVkVSU0lPTiI6e30sIlNBUFBISVJFX0lOUFVUUyI6eyJ2aXNpdG9yX2lkIjoiMDAwMDAwMDAwMzMwMDEwMTcyRDJCMUM0N0QzMTI4Q0UiLCJzYXBwaGlyZV9wYWdlIjoiL3AvQS0xMzM3NjM4OSIsInNhcHBoaXJlX2NoYW5uZWwiOiJXRUIifSwiVklTSVRPUl9JRCI6eyJ2aXNpdG9yX2lkIjoiMDAwMDAwMDAwMzMwMDEwMTcyRDJCMUM0N0QzMTI4Q0UifSwiUEFHRV9UWVBFIjp7InJlZG9ha19wYWdlX3R5cGUiOiJQRFAifX0sIm1vZHVsZSI6eyJQTEFURk9STSI6eyJwbGF0Zm9ybSI6IldFQiJ9LCJJU19BTk9OWU1PVVMiOnsiaXNfYW5vbnltb3VzIjp0cnVlfSwiRklORFNfUE9TVFNfUFJPRFVDVF9JTlBVVFMiOnsiaW5jbHVkZV9maW5kc19sb25nX2Zvcm1fdmlkZW9zIjp0cnVlLCJpbmNsdWRlX2ZpbmRzX3Nob3J0X2Zvcm1fdmlkZW9zIjp0cnVlfSwiSVNfU0VPX0JPVCI6eyJpc19zZW9fYm90IjpmYWxzZX0sIlRDSU4iOnsidGNpbiI6IjEzMzc2Mzg5In0sIlNFTEVDVEVEX0NISUxEX1RDSU4iOnsic2VsZWN0ZWRfY2hpbGRfdGNpbiI6IjEzMzc2Mzg5In0sIlJFQ09NTUVOREVEX1RDSU5TIjp7InJlY29tbWVuZGVkX3RjaW5zIjpbIjEzMzc2Mzg5Il19LCJQUklDSU5HX0NPTlRFWFQiOnsicHJpY2luZ19jb250ZXh0IjoiZGlnaXRhbCJ9LCJQUklWQUNZX0RPX05PVF9TRUxMIjp7InByaXZhY3lfZG9fbm90X3NlbGwiOmZhbHNlfSwiUkFUSU5HU19SRVZJRVdTX0lOUFVUUyI6eyJyYXRpbmdzX3Jldmlld3NfaW5jbHVkZXMiOlsicmV2aWV3cyIsInJldmlld3NXaXRoTWVkaWEiLCJtZWRpYVRodW1ibmFpbHMiLCJlbnRpdGllcyIsIm1ldGFkYXRhIiwic3RhdGlzdGljcyJdLCJyYXRpbmdzX3Jldmlld3NfcmV2aWV3X3R5cGUiOiJQUk9EVUNUIiwicmF0aW5nc19yZXZpZXdzX3BhZ2UiOjAsInJhdGluZ3NfcmV2aWV3c19zaXplIjo4LCJyYXRpbmdzX3Jldmlld3Nfc29ydF9ieSI6Im1vc3RfcmVjZW50IiwicmF0aW5nc19yZXZpZXdzX2hhc19vbmx5X3Bob3RvcyI6ZmFsc2UsInJhdGluZ3NfcmV2aWV3c19oYXNfb25seV92aWRlb3MiOmZhbHNlLCJyYXRpbmdzX3Jldmlld3NfdmVyaWZpZWRfb25seSI6ZmFsc2V9LCJUQVJHRVRFRF9BRFZFUlRJU0lOR19PUFRfT1VUIjp7InRhcmdldGVkX2FkdmVydGlzaW5nX29wdF9vdXQiOmZhbHNlfSwiQ0FURUdPUllfSUQiOnsiY2F0ZWdvcnlfaWQiOiI1eHN6NCJ9LCJSQURFVVNfUEFHRV9CUkVBRENSVU1CIjp7InJhZGV1c19wYWdlX2JyZWFkY3J1bWIiOlsicm9vdCIsIjV4dDFhIiwiNXhzemQiLCI1eHN6NCJdfX0sIm1vZHVsZV9lbnJpY2htZW50X2NvbnRleHRzIjpbeyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZUNpcmNsZU9mZmVycyJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlQ2lyY2xlT2ZmZXJzIn0seyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZUZ1bGZpbGxtZW50QW5kVmFyaWF0aW9ucyJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlRnVsZmlsbG1lbnRBbmRWYXJpYXRpb25zIn0seyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZVBlcnNvbmFsaXplZCJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlUGVyc29uYWxpemVkIn0seyJtb2R1bGVfaGllcmFyY2h5Ijp7ImxheW91dF9pZCI6IndlYl9wZHBfZnJlcXVlbmN5X2dyb2NlcnkiLCJ6b25lX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX2dyb3VwX2lkIjoiZGF0YXNvdXJjZV9tb2R1bGVzIiwibW9kdWxlX3BsYWNlbWVudF9pZCI6ImRhdGFzb3VyY2VfbW9kdWxlc19Qcm9kdWN0RGV0YWlsV2ViRGF0YXNvdXJjZVdpdGhTdG9yZSJ9LCJ1cGRhdGVzX29uX2FjdGlvbnMiOltdLCJtb2R1bGVfdHlwZSI6IlByb2R1Y3REZXRhaWxXZWJEYXRhc291cmNlV2l0aFN0b3JlIn1dfQ==';

function makeVisitorId(): string {
  return crypto.randomUUID().replaceAll('-', '').toUpperCase().slice(0, 32);
}

function encodeContext(context: ModuleContext): string {
  return Buffer.from(
    JSON.stringify(context),
    'utf8'
  ).toString('base64');
}

function buildRequestBody(
  tcin: string,
  visitorId: string
) {
  const decodedText = Buffer.from(
    TEMPLATE_PAGE_CONTEXT,
    'base64'
  ).toString('utf8');

  const replacedText = decodedText
    .replaceAll(TEMPLATE_TCIN, tcin)
    .replaceAll(TEMPLATE_VISITOR_ID, visitorId);

  const pageContextObject = JSON.parse(replacedText);

  const contexts: ModuleContext[] =
    pageContextObject.module_enrichment_contexts ?? [];

  const wantedTypes = new Set([
    'ProductDetailWebDatasourceFulfillmentAndVariations',
    'ProductDetailAvailabilitySneakPeek',
    'ProductDetailFulfillment',
  ]);

  const modules = contexts
    .filter((context) =>
      wantedTypes.has(context.module_type ?? '')
    )
    .map((context) => ({
      module_placement_id:
        context.module_hierarchy?.module_placement_id ?? '',
      module_type:
        context.module_type ?? '',
      enrichment_context:
        encodeContext(context),
    }))
    .filter(
      (module) =>
        module.module_placement_id &&
        module.module_type
    );

  return {
    page_context: Buffer.from(
      replacedText,
      'utf8'
    ).toString('base64'),

    modules,
  };
}

function numeric(value: unknown): number | null {
  if (
    typeof value === 'number' &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === 'string' &&
    value.trim() !== ''
  ) {
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
  const value =
    String(availability || '').toUpperCase();

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

function findFulfillmentResult(
  payload: any,
  storeId: string
): {
  quantity: number | null;
  availability: string;
} | null {
  const modules =
    Array.isArray(payload?.modules)
      ? payload.modules
      : [];

  for (const module of modules) {
    if (
      module?.module_type !==
      'ProductDetailWebDatasourceFulfillmentAndVariations'
    ) {
      continue;
    }

    const product =
      module?.module_data?.data?.product;

    const options =
      product?.fulfillment?.store_options;

    if (!Array.isArray(options)) {
      continue;
    }

    const storeOption = options.find(
      (option: any) =>
        String(option?.location_id) ===
        String(storeId)
    );

    if (!storeOption) {
      continue;
    }

    const quantity =
      numeric(
        storeOption
          ?.location_available_to_promise_quantity
      );

    const availability =
      String(
        storeOption
          ?.order_pickup
          ?.availability_status ??
          storeOption
            ?.in_store_only
            ?.availability_status ??
          'UNKNOWN'
      );

    return {
      quantity,
      availability,
    };
  }

  return null;
}

export async function fetchTargetInventory(
  input: Input
): Promise<InventoryResult> {
  const key =
    process.env.TARGET_REDSKY_KEY;

  const fetchedAt =
    new Date().toISOString();

  if (!key) {
    return {
      tcin: input.tcin,
      storeId: input.storeId,
      quantity: null,
      status: 'UNKNOWN',
      availability: 'CONFIG_REQUIRED',
      source: 'TARGET_PDP',
      fetchedAt,
      error:
        'TARGET_REDSKY_KEY is not configured.',
    };
  }

  const store =
    stores.find(
      (s) => s.id === input.storeId
    );

  if (!store) {
    return {
      tcin: input.tcin,
      storeId: input.storeId,
      quantity: null,
      status: 'UNKNOWN',
      availability: 'STORE_NOT_FOUND',
      source: 'TARGET_PDP',
      fetchedAt,
      error:
        `Store ${input.storeId} was not found in data/stores.ts.`,
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
      availability:
        'STORE_LOCATION_MISSING',
      source: 'TARGET_PDP',
      fetchedAt,
      error:
        `Store ${input.storeId} is missing ZIP/latitude/longitude in data/stores.ts.`,
    };
  }

  try {
    const visitorId =
      makeVisitorId();

    const requestBody =
      buildRequestBody(
        input.tcin,
        visitorId
      );

    const params =
      new URLSearchParams({
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
          store.timezone ??
          'America/Chicago',

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

    const response =
      await fetch(url, {
        method: 'POST',

        headers: {
          accept:
            'application/json, text/plain, */*',

          'accept-language':
            'en-US,en;q=0.9',

          'content-type':
            'application/json',

          origin:
            'https://www.target.com',

          referer:
            `https://www.target.com/p/-/A-${input.tcin}`,

          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
        },

        body:
          JSON.stringify(
            requestBody
          ),

        cache:
          'no-store',
      });

    if (!response.ok) {
      const text =
        await response.text();

      return {
        tcin:
          input.tcin,

        storeId:
          input.storeId,

        quantity:
          null,

        status:
          'UNKNOWN',

        availability:
          'API_ERROR',

        source:
          'TARGET_PDP',

        fetchedAt,

        error:
          `Target PDP enrichment returned HTTP ${response.status}` +
          (
            text
              ? `: ${text.slice(0, 300)}`
              : ''
          ),
      };
    }

    const payload =
      await response.json();

    const result =
      findFulfillmentResult(
        payload,
        input.storeId
      );

    if (!result) {
      return {
        tcin:
          input.tcin,

        storeId:
          input.storeId,

        quantity:
          null,

        status:
          'UNKNOWN',

        availability:
          'NO_INVENTORY_DATA',

        source:
          'TARGET_PDP',

        fetchedAt,

        error:
          'Target accepted the request, but the fulfillment module for this store was not returned.',
      };
    }

    return {
      tcin:
        input.tcin,

      storeId:
        input.storeId,

      quantity:
        result.quantity,

      status:
        classify(
          result.quantity,
          result.availability
        ),

      availability:
        result.availability,

      source:
        'TARGET_PDP',

      fetchedAt,
    };
  } catch (error) {
    return {
      tcin:
        input.tcin,

      storeId:
        input.storeId,

      quantity:
        null,

      status:
        'UNKNOWN',

      availability:
        'API_ERROR',

      source:
        'TARGET_PDP',

      fetchedAt,

      error:
        error instanceof Error
          ? error.message
          : 'Unknown Target PDP request error.',
    };
  }
}
