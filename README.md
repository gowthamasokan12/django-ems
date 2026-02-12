# Employee Management System - API Documentation

## 🚀 Quick Start

### Installation & Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate
# Or on macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create sample data
python manage.py populate_data

# Start development server
python manage.py runserver
```

### Access Points
- **Swagger UI**: http://127.0.0.1:8000/swagger/
- **ReDoc**: http://127.0.0.1:8000/redoc/
- **Admin Panel**: http://127.0.0.1:8000/admin/
- **API Base**: http://127.0.0.1:8000/api/

## 👥 Test Accounts

| Username | Password | Role | Permissions |
|----------|----------|------|-------------|
| hrmanager | password123 | HR Manager | Full CRUD access to all resources + user management |
| techmanager | password123 | Technical Manager | Full CRUD access to employees and departments |
| hrstaff | password123 | HR | Full CRUD for employees, read-only for departments |
| developer1 | password123 | Developer | Read-only access to all resources |
| developer2 | password123 | Developer | Read-only access to all resources |

## 🔐 Authentication

### 1. Register a New User
**POST** `/api/auth/register/`

```json
{
  "username": "newuser",
  "email": "newuser@company.com",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "555-1234",
  "department": 1,
  "position": "Software Engineer",
  "salary": "75000.00",
  "hire_date": "2026-02-11",
  "role": "DEVELOPER"
}
```

### 2. Login (Get JWT Token)
**POST** `/api/auth/login/`

```json
{
  "username": "hrmanager",
  "password": "password123"
}
```

**Response:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "username": "hrmanager",
    "email": "hrmanager@company.com",
    "role": "HR_MANAGER",
    "full_name": "Sarah Johnson"
  }
}
```

### 3. Use Token in Requests
Add the access token to the Authorization header:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 4. Refresh Token
**POST** `/api/auth/token/refresh/`

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## 📋 API Endpoints

### Employees

#### List All Employees
**GET** `/api/employees/`
- **Permissions**: All authenticated users (read-only for Developers)
- **Query Parameters**:
  - `department`: Filter by department ID
  - `role`: Filter by role (DEVELOPER, TECHNICAL_MANAGER, HR, HR_MANAGER)
  - `is_active`: Filter by active status (true/false)
  - `search`: Search by name, email, or position
  - `ordering`: Order by fields (e.g., `-created_at`, `first_name`)
  - `page`: Page number for pagination

**Example:**
```
GET /api/employees/?department=1&is_active=true&search=developer&page=1
```

#### Get Employee Details
**GET** `/api/employees/{id}/`

#### Get Current User's Profile
**GET** `/api/employees/me/`

#### Get Employees by Department
**GET** `/api/employees/by_department/?department_id=1`

#### Create Employee
**POST** `/api/employees/`
- **Permissions**: HR, Technical Manager, HR Manager

```json
{
  "username": "newemployee",
  "password": "password123",
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@company.com",
  "phone": "555-5678",
  "department": 1,
  "position": "Backend Developer",
  "salary": "80000.00",
  "hire_date": "2026-02-11",
  "is_active": true,
  "role": "DEVELOPER"
}
```

#### Update Employee
**PUT** `/api/employees/{id}/` or **PATCH** `/api/employees/{id}/`
- **Permissions**: HR, Technical Manager, HR Manager

#### Delete Employee
**DELETE** `/api/employees/{id}/`
- **Permissions**: HR, Technical Manager, HR Manager

### Departments

#### List All Departments
**GET** `/api/departments/`
- **Permissions**: All authenticated users
- **Query Parameters**:
  - `search`: Search by name or description
  - `ordering`: Order by fields

#### Get Department Details
**GET** `/api/departments/{id}/`

#### Create Department
**POST** `/api/departments/`
- **Permissions**: Technical Manager, HR Manager

```json
{
  "name": "Product Management",
  "description": "Product strategy and roadmap"
}
```

#### Update Department
**PUT** `/api/departments/{id}/` or **PATCH** `/api/departments/{id}/`
- **Permissions**: Technical Manager, HR Manager

#### Delete Department
**DELETE** `/api/departments/{id}/`
- **Permissions**: Technical Manager, HR Manager

## 🔒 Role-Based Permissions

| Role | Employees | Departments |
|------|-----------|-------------|
| **Developer** | Read-only | Read-only |
| **Technical Manager** | Full CRUD | Full CRUD |
| **HR** | Full CRUD | Read-only |
| **HR Manager** | Full CRUD | Full CRUD |

## 🧪 Testing with Swagger

1. **Open Swagger UI**: Navigate to http://127.0.0.1:8000/swagger/

2. **Authenticate**:
   - Click the "Authorize" button (lock icon)
   - Login to get your JWT token
   - Enter: `Bearer <your_access_token>`
   - Click "Authorize"

3. **Test Endpoints**:
   - Expand any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"

## 📊 Database Schema

### Employee Model
- `id`: Primary key
- `user`: One-to-one link to Django User
- `first_name`, `last_name`: Name fields
- `email`: Unique email address
- `phone`: Contact number
- `department`: Foreign key to Department
- `position`: Job title
- `salary`: Decimal field
- `hire_date`: Date field
- `is_active`: Boolean status
- `role`: Choice field (DEVELOPER, TECHNICAL_MANAGER, HR, HR_MANAGER)
- `created_at`, `updated_at`: Timestamps

### Department Model
- `id`: Primary key
- `name`: Unique department name
- `description`: Text description
- `created_at`, `updated_at`: Timestamps

## 🛠️ Technology Stack

- **Framework**: Django 4.2.9
- **REST API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt 5.3.1)
- **Documentation**: drf-yasg 1.21.7 (Swagger/OpenAPI)
- **Database**: SQLite (default)
- **Filtering**: django-filter 23.5
- **CORS**: django-cors-headers 4.3.1

## 📝 Example Workflow

### 1. Login as HR Manager
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "hrmanager", "password": "password123"}'
```

### 2. List All Employees
```bash
curl -X GET http://127.0.0.1:8000/api/employees/ \
  -H "Authorization: Bearer <access_token>"
```

### 3. Create New Employee
```bash
curl -X POST http://127.0.0.1:8000/api/employees/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newdev",
    "password": "password123",
    "first_name": "New",
    "last_name": "Developer",
    "email": "newdev@company.com",
    "department": 1,
    "position": "Junior Developer",
    "salary": "65000.00",
    "hire_date": "2026-02-11",
    "role": "DEVELOPER"
  }'
```

### 4. Filter Employees by Department
```bash
curl -X GET "http://127.0.0.1:8000/api/employees/?department=1" \
  -H "Authorization: Bearer <access_token>"
```

## 🔍 Features

✅ Complete CRUD operations for Employees and Departments  
✅ JWT-based authentication with token refresh  
✅ Role-based access control (4 roles)  
✅ Filtering, searching, and pagination  
✅ Swagger/OpenAPI documentation  
✅ Admin panel integration  
✅ Sample data for testing  
✅ SQLite database (easy to switch to PostgreSQL/MySQL)  
✅ CORS enabled for frontend integration  

## 🚨 Security Notes

- Change `SECRET_KEY` in production
- Set `DEBUG = False` in production
- Configure `ALLOWED_HOSTS` properly
- Use environment variables for sensitive data
- Update `CORS_ALLOW_ALL_ORIGINS` to specific domains in production
- Implement rate limiting for production
- Use HTTPS in production

## 📞 Support

For issues or questions, refer to the Django and DRF documentation:
- Django: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- drf-yasg: https://drf-yasg.readthedocs.io/
