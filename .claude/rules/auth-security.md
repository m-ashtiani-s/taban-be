# Auth & Security Rules

### Auth Middleware Chain
Authentication and authorization are applied as route-level middleware:
- **Public** routes: no middleware.
- **Auth** routes (`/auth`): no auth middleware (login/otp/register flow itself).
- **User** routes: `AuthMiddleware` only.
- **Admin** routes: `AuthMiddleware` + `AdminAuthMiddleware`.
- **Enterprise-only** sub-routes: add `EnterpriseAuthMiddleware` after `AuthMiddleware` (it checks `customerType === "ENTERPRISE"`). Applied at the specific sub-router that needs it, not globally.

`AuthMiddleware` always comes first (it populates `req.user`); role/type guards come after it.

### Input Validation
Every endpoint must have a corresponding validation file (`*.validation.ts`) using `express-validator`. Validation rules are applied at the route level, not inside controllers or services. Controllers surface validation errors via the shared `showValidationErrors` helper (`ControllerBase`).
