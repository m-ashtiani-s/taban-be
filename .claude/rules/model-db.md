# Model & Database Rules

### Mongoose Schema With Timestamps
All Mongoose schemas must be defined with `{ timestamps: true }` so every document has `createdAt` / `updatedAt`. Default list sorting relies on `createdAt`.

### Transform Pattern
Never return a raw Mongoose document from a controller. Always pass it through the module's Transform class first, which maps the document to its DTO and strips internal fields. Provide both a single and a list method (e.g. `new OrderTransform().order(doc)` and `.orders(docs)`).

### Pagination Standard
All list endpoints use the shared `Pagination` utility (`shared/utils/pagination.util.ts`).
- **Input** query params: `page`, `pageSize`, `sortOrders` (format `"field:ASC"` / `"field:DESC"`, default `createdAt:DESC`).
- **Output** shape must always be: `page`, `pageSize`, `totalPages`, `totalElements`, `elements`.
- The paginated result is returned inside the standard response `data` field.
