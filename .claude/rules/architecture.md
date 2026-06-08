# Architecture & Structure Rules

### Module Structure
Each feature module must contain exactly these subdirectories: `controller`, `service`, `repository`, `model`, `dto`, `validation`, `transform`. Do not add extra layers or skip any of them.

### Layered Architecture
Data flow is strictly one-directional: Controller → Service → Repository. Controllers never touch Repository or Mongoose directly. Repositories never contain business logic.

### File Naming
All files use camelCase with a mandatory type suffix:
- `*.controller.ts` / `*.service.ts` / `*.repository.ts`
- `*.model.ts` / `*.dto.ts` / `*.validation.ts` / `*.transform.ts`
- Admin-specific files are prefixed with `admin`: `adminOrder.controller.ts`, `adminOrder.service.ts`

### Admin Separation
Admin logic must live in separate files from user logic. Never write admin-specific code inside the regular controller or service file. Each module that has admin functionality must have its own `admin[Module].controller.ts` and `admin[Module].service.ts` alongside the regular ones.
