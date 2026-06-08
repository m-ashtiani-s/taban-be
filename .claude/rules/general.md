# General Rules

### Route Versioning
All routes are mounted under the `/api/web/v1/` prefix (`/api` → `/web` → `/v1`) and must be grouped into one of these scopes:
- `/v1/public` — open, no auth (mounted at `/v1`).
- `/v1/auth` — authentication flow (login, otp, register).
- `/v1/user` — authenticated user routes.
- `/v1/admin` — admin-only routes.

New versions get a new prefix segment (`/v2`), never breaking changes inside `/v1`.

### TypeScript Strict Types
Avoid `any`. Every function parameter and return value must have an explicit interface or type. Use DTOs defined in `*.dto.ts` files for all input/output contracts.
