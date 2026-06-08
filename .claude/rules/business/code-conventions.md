# Business — Code Convention Rules

### Module-Level Singleton Instance
Service/controller/repository instances are created once at module scope (`const orderService = new OrderService();`), never re-instantiated inside a request handler.

### Async/Await, Not Callbacks
All asynchronous code uses `async/await` with `try/catch`. No `.then()` chains, nested callbacks, or callback-style Mongoose calls.

### Env over Hardcode
Secrets and environment-specific values (JWT secret, Mongo URI, ports, CORS origins, external URLs) are read from `.env` via `process.env`, never hardcoded in source (including `config/config.ts`).
