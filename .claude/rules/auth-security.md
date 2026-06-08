# Auth & Security Rules

### Auth Middleware Chain
- Admin routes: `AuthMiddleware` + `AdminAuthMiddleware`
- User routes: `AuthMiddleware` only
- Public routes: no middleware

### Input Validation
Every endpoint must have a corresponding validation file (`*.validation.ts`) using `express-validator`. Validation rules are applied at the route level, not inside controllers or services.
