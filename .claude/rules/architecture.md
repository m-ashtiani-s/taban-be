# Architecture & Structure Rules

### Module Structure
A feature module is organized into these layers, each in its own subdirectory:
`controller`, `service`, `repository`, `model`, `dto`, `validation`, `transform`.

Include a subdirectory only when it has a real purpose. If a layer does not apply to a module, omit it — do not create empty folders or placeholder files. For example, a pure computation module like `rateCalculator` that never touches the database has no `model` or `repository`.

### Layered Architecture
Data flow is strictly one-directional: Controller → Service → Repository.
- Controllers must not perform database queries or call Mongoose models directly. All data access goes through a Repository (usually via a Service).
- Importing **types or enums** from a model file (e.g. `import { OrderStatus } from "../model/order.model"`) is allowed in any layer — that is a type reference, not a database operation.
- Repositories contain only data-access logic, never business rules.

### File Naming
All files use camelCase with a mandatory type suffix:
- `*.controller.ts` / `*.service.ts` / `*.repository.ts`
- `*.model.ts` / `*.dto.ts` / `*.validation.ts` / `*.transform.ts`
- The repository **folder** is singular: `repository/` (not `repositories/`).
- Admin-specific files use the `.admin.` infix, keeping the domain name first so all files of a module sort together:
  `order.admin.controller.ts`, `order.admin.service.ts`, `customer.admin.repository.ts`.

### Admin Separation
Admin logic must live in separate files from user logic — never mix admin-specific code into a regular controller or service.
- If a module serves both regular and admin clients, it has both files side by side: `order.controller.ts` **and** `order.admin.controller.ts`.
- If a resource is inherently admin-only (e.g. `coupon`, `justiceInquiry`), it is valid to ship only the `.admin.` files with no regular counterpart.
