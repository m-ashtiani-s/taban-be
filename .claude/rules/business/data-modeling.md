# Business — Data Modeling Rules

### Centralized Enums in Model
Every enum (status, type, role, …) is defined and exported once in its model file. Never scatter raw string literals (`"ADMIN"`, `"pending"`, `"ENTERPRISE"`) across controllers/services — import the enum/type from the model instead.

### Deliberate Indexing
A field must be indexed in exactly one place. Do not combine `unique: true` / `index: true` on a field with a separate `schema.index()` on the same single field — that creates a duplicate-index warning. Use `unique: true` for uniqueness; reserve `schema.index()` for compound indexes only.

### ObjectId Validation
Any route that receives an id (param, query, or body) must validate it as a valid Mongo ObjectId in its `*.validation.ts` (e.g. `isMongoId`) before it reaches the service, to avoid Mongoose cast errors.

### Consistent ref Naming
The string passed to `ref:` must exactly match the name registered in `mongoose.model("Name", …)` for that collection. Keep model registration names consistent (pick one casing convention and apply it everywhere).
