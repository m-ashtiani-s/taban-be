# Business — Structure Rules

### Separate Filter DTO
Query parameters for list endpoints are typed in their own `*Filters.dto.ts` file (e.g. `orderFilters.dto.ts`), not inlined inside the main DTO file or the controller.

### Index Route File
Every scope/resource has its own `index.ts` router file, mounted hierarchically (`/api/web/v1/<scope>/<resource>`). No route definitions outside an `index.ts` router.

### Transform Single and List Methods
A Transform class for a resource that has a list endpoint must expose both a single-document method and a list method (e.g. `order(doc)` and `orders(docs)`), even if only one is currently used.
Resources that are inherently single — a user's one cart, a login token, a one-off computation result — only need the single method; no empty/stub list method is required just to satisfy the rule.
