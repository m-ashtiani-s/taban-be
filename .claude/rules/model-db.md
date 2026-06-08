# Model & Database Rules

### Mongoose Schema With Timestamps
All Mongoose schemas must include `{ timestamps: true }`.

### Transform Pattern
Never return a raw Mongoose document from a controller. Always pass it through the module's Transform class before sending the response.

### Pagination Standard
All list endpoints use the `Pagination` utility. Response shape must always include: `page`, `pageSize`, `totalPages`, `totalElements`, `elements`.
