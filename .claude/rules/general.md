# General Rules

### Route Versioning
All routes live under `/api/web/v1/` and must be scoped to one of: `admin`, `user`, or `public`.

### TypeScript Strict Types
Avoid `any`. Every function parameter and return value must have an explicit interface or type. Use DTOs defined in `*.dto.ts` files for all input/output contracts.
