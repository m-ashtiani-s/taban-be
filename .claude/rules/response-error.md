# Response & Error Handling Rules

### Standard Response Format
Every API response must follow this exact structure:
```json
{ "field": "actionName", "success": true, "data": {}, "message": "پیام فارسی" }
```

### Persian Messages
All user-facing messages (success and error) must be written in Persian (Farsi).

### Custom Errors in Service
Services throw `BadRequestError` or `NotFoundError` for domain errors. Controllers only catch and format — they never generate business error messages themselves.

### Controller Try-Catch
Every controller method must have a try-catch block. Map `BadRequestError` → 400, everything else → 500.
