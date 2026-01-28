# Sport Club Management API Documentation

This project now includes comprehensive OpenAPI/Swagger documentation for all REST API endpoints.

## Accessing API Documentation

Once the Django development server is running, you can access the API documentation through the following URLs:

### Swagger UI (Interactive Documentation)
**URL:** http://127.0.0.1:8000/api/docs/

The Swagger UI provides an interactive interface where you can:
- View all available API endpoints
- See detailed request/response schemas
- Try out API calls directly from the browser
- View authentication requirements

### ReDoc (Alternative Documentation View)
**URL:** http://127.0.0.1:8000/api/redoc/

ReDoc provides a clean, three-panel documentation interface with:
- Easy navigation
- Detailed endpoint descriptions
- Request/response examples

### OpenAPI Schema (Raw YAML/JSON)
**URL:** http://127.0.0.1:8000/api/schema/

The raw OpenAPI 3.0 schema in YAML format, useful for:
- Importing into API testing tools (Postman, Insomnia, etc.)
- Code generation
- CI/CD integration

## Authentication

Most endpoints require JWT authentication. To use authenticated endpoints in Swagger UI:

1. **Obtain Access Token:**
   - Use the `/auth/token/` endpoint (POST)
   - Provide your username and password
   - Copy the `access` token from the response

2. **Authorize in Swagger UI:**
   - Click the "Authorize" button (lock icon) at the top right
   - Enter: `Bearer <your_access_token>`
   - Click "Authorize"
   - Now you can test authenticated endpoints

## API Endpoints Overview

### Authentication
- `POST /auth/token/` - Obtain JWT access and refresh tokens
- `POST /auth/token/refresh/` - Refresh access token
- `POST /auth/login/` - Legacy login endpoint
- `POST /auth/logout/` - Logout endpoint
- `GET /auth/me/` - Get current user information

### Members
- `GET /members/` - List all members (supports search and sort)
- `POST /members/` - Create a new member
- `GET /members/{id}/` - Get member details
- `PUT /members/{id}/` - Update member
- `DELETE /members/{id}/` - Delete member

### Activities
- `GET /activities/` - List all activities (supports search and sort)
- `POST /activities/` - Create a new activity
- `GET /activities/{id}/` - Get activity details
- `PUT /activities/{id}/` - Update activity
- `DELETE /activities/{id}/` - Delete activity

### Enrollments
- `GET /enrollments/` - List all enrollments
- `POST /enrollments/` - Create a new enrollment
- `GET /enrollments/{id}/` - Get enrollment details
- `PUT /enrollments/{id}/` - Update enrollment
- `DELETE /enrollments/{id}/` - Delete enrollment

### Statistics
- `GET /stats/` - Get statistics overview
- `GET /stats/activities/` - Get detailed activity statistics
- `GET /stats/members-per-activity/` - Get members grouped by activity

## Features

### Search & Filter
Many endpoints support query parameters for searching and filtering:
- **Members:** `?search=name` - Search by first or last name
- **Activities:** `?search=activity_name` - Search by activity name
- **Sort:** Use `?sort=field` or `?sort=-field` for ascending/descending

### Request/Response Examples
Each endpoint in the Swagger UI includes:
- Example request payloads
- Example successful responses
- Example error responses
- Field descriptions and validation rules

### Error Handling
The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid authentication)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found

## Configuration

The API documentation is configured using `drf-spectacular`. Configuration can be modified in `myproject/settings.py`:

```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'Sport Club Management API',
    'DESCRIPTION': 'API documentation for Sport Club Management System',
    'VERSION': '1.0.0',
    ...
}
```

## Generating OpenAPI Schema File

To export the OpenAPI schema to a file:

```bash
python manage.py spectacular --color --file schema.yml
```

This generates a `schema.yml` file that can be used with various tools.

## Additional Resources

- [drf-spectacular Documentation](https://drf-spectacular.readthedocs.io/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Django REST Framework](https://www.django-rest-framework.org/)
