# Model & Database Rules

### Mongoose Schema With Timestamps
All Mongoose schemas must be defined with `{ timestamps: true }` so every document has `createdAt` / `updatedAt`. Default list sorting relies on `createdAt`.

### Transform Pattern
Never return a raw Mongoose document from a controller. Always pass it through the module's Transform class first, which maps the document to its DTO and strips internal fields. Provide both a single and a list method (e.g. `new OrderTransform().order(doc)` and `.orders(docs)`).

### Pagination Standard
Pagination is **not** mandatory for every list endpoint. Small, bounded reference/lookup lists (e.g. languages, embassies, document categories — data meant to fill a dropdown) may return the full collection as a plain array. Use pagination for unbounded, user/transactional collections (orders, customers, coupons, shipping addresses, …).

When an endpoint **is** paginated, it must follow this standard exactly:
- Use the shared `Pagination` utility (`shared/utils/pagination.util.ts`).
- **Input** query params: `page`, `pageSize`, `sortOrders` (format `"field:ASC"` / `"field:DESC"`, default `createdAt:DESC`).
- **Output** shape must always be: `page`, `pageSize`, `totalPages`, `totalElements`, `elements`.
- The paginated result is returned inside the standard response `data` field.
- The `elements` array must be mapped through the module's Transform class (e.g. `transform.paginatedOrders(...)` calling `transform.order(doc)` per element) — never return raw Mongoose documents inside `elements`.

Whether paginated or a plain array, every list still goes through the Transform layer (see **Transform Pattern**).
