# API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": { ... }
}
```

## Endpoints

> Endpoints will be documented here as modules are implemented.

### Health Check
- `GET /health` — Server health status

### API Info
- `GET /api` — API version and metadata

## API Versioning

API versioning strategy will be implemented as needed (URL prefix: `/api/v1/`).
