# Target In-Stock Command Center

A clean-room, standalone Target store inventory MVP. It does not depend on any existing user repository.

## What works in v0.1
- Store + TCIN product matrix
- Server-side Target Redsky adapter with two fulfillment endpoint fallbacks
- OOS / Low / Healthy / Unknown classification
- API errors remain UNKNOWN, never fake OOS
- OOS-first sorting and filters
- CSV export
- Vercel-ready Next.js app

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `TARGET_REDSKY_KEY` to the current public key embedded by Target's web frontend.
4. `npm run dev`

## Add real stores
Edit `data/stores.ts` and add Target store ID, name, city/state/ZIP and coordinates.

## Add real products
Edit `data/products.ts` and add TCIN, brand, product name and category.

## Safety / correctness behavior
Target.com says availability changes quickly and is not guaranteed. This app therefore distinguishes a true reported zero / out-of-stock response from HTTP failures, parser failures, or missing configuration. Failures are UNKNOWN and visible for troubleshooting.

## Next build phase
- Product Master CSV/XLSX import
- Store Master import / Target store lookup
- Postgres/Supabase history snapshots
- Scheduled refresh batches with rate limiting
- Days OOS / repeat OOS / trend scoring
- Real .xlsx export and daily email exception report
- Brand/category filters
