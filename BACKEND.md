# LaunchReady AI backend

This backend was added without changing the existing frontend files. It follows the PRD's deterministic decision-support architecture and exposes both the PRD paths and `/api/v1` aliases.

## Endpoints

- `POST /api/mission/load`
- `POST /api/review/run`
- `GET /api/review/:id/status`
- `GET /api/review/:id`
- `POST /api/review/:id/finding/:fid/review`
- `GET /api/review/:id/export`

Equivalent `/api/v1/...` routes are also provided.

## Pipeline

Validate → Normalize → Evaluate Rules → Analyze Trends → Compare Reviews → Retrieve Evidence → Assemble and Validate Report → Save

The rule, trend, diff, confidence, evidence, and output validation stages are deterministic. AI remains bounded to the existing `/api/chat` integration and cannot define computed statuses, numeric results, priorities, trends, confidence, or unsupported actions.

## Demo fixture

The backend uses the existing Aster-2 mission fixture from `lib/mission.ts` through `lib/server/fixtures/aster2.ts`. The existing frontend files are intentionally unchanged.

## Persistence

The included store is an in-process MVP store. This is suitable for a local/demo server but is not durable across serverless instances. A production deployment should replace `lib/server/storage/store.ts` with a durable database or supported persistent storage before multi-user use.
