# Business — Data Modeling Rules

### Centralized Enums in Model
Every enum (status, type, role, …) is defined and exported once in its model file. Never scatter raw string literals (`"ADMIN"`, `"pending"`, `"ENTERPRISE"`) across controllers/services — import the enum/type from the model instead.

### Deliberate Indexing
A field must be indexed in exactly one place. Do not combine `unique: true` / `index: true` on a field with a separate `schema.index()` on the same single field — that creates a duplicate-index warning. Use `unique: true` for uniqueness; reserve `schema.index()` for compound indexes only.

### ObjectId Validation
When a route receives a value that will be used as a Mongo `_id` / ObjectId (param, query, or body), that field must be validated as a valid ObjectId in its `*.validation.ts` (e.g. `isMongoId`) before it reaches the service, to avoid Mongoose cast errors.
This applies only to actual ObjectId inputs. Routes that identify the user/resource by other means — e.g. the auth flow keying off phone number / username / OTP — are not subject to this rule.

### Consistent ref Naming
The string passed to `ref:` must exactly match the name registered in `mongoose.model("Name", …)` for that collection. Keep model registration names consistent (pick one casing convention and apply it everywhere).
