# Response & Error Handling Rules

### Standard Response Format
Every API response — success or error — must follow this exact structure:
```json
{ "field": "actionName", "success": true, "data": {}, "message": "پیام فارسی" }
```
- `field`: the controller action/method name (e.g. `"createOrder"`), used by the client to identify the source.
- `success`: boolean operation result.
- `data`: the payload on success, `null` on error.
- `message`: a Persian status message.

### Persian Messages
All user-facing messages (success and error) must be written in Persian (Farsi).

### Custom Errors in Service
Services throw `BadRequestError` or `NotFoundError` (from `shared/base`) for domain errors. Controllers only catch and format — they never generate business error messages themselves.

### Controller Try-Catch
Every controller method must have a try-catch block that maps the error name to an HTTP status:
- `BadRequestError` → **400**
- `NotFoundError` → **404**
- anything else → **500**

```ts
catch (error: ControllerError) {
  const statusCode =
    error.name === "BadRequestError" ? 400 :
    error.name === "NotFoundError" ? 404 : 500;
  return res.status(statusCode).json({ field: "actionName", success: false, data: null, message: error.message || "پیام پیش‌فرض فارسی" });
}
```

> **TODO (business review):** The mapping above is the baseline. We still need to audit each endpoint and decide the *correct* status code per business case (e.g. 401, 403, 409, 422) instead of collapsing everything to 400/404/500. Pick the meaningful code at the point where the error is thrown, driven by the domain — revisit this together.
