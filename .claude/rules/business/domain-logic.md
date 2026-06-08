# Business — Domain Logic Rules

### Price from Rate Service
Monetary amounts (prices, totals, discounts) must never be trusted from the client. The server always recomputes them through `rateCalculator` / the relevant rate repositories. The client may send selections (item, language, count) but never the final price.

### Transactions for Multi-Step Operations
Any operation that writes to more than one collection (e.g. creating an order from a cart, applying a coupon while decrementing usage) must run inside a MongoDB session/transaction with commit/abort. Never leave the database in a half-written state on error.

### No Business Logic in Controller
Controllers do only three things: run the validation result, call a service, and format the response. No domain conditionals, calculations, status transitions, or DB access in a controller — all of that belongs in the service.
