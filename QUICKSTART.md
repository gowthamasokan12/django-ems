# Quick Start Guide

## 🚀 Getting Started in 5 Steps

### 1. Set Up Virtual Environment
```bash
cd "c:\Users\user\OneDrive\Documents\Python Scripts\Antigravity Demo\employee_management"

# Create virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py populate_data
```

### 3. Start the Server
```bash
python manage.py runserver
```

### 4. Access Swagger UI
Open your browser and navigate to:
```
http://127.0.0.1:8000/swagger/
```

### 3. Test the API

#### Login to Get Token
1. In Swagger UI, find **POST /api/auth/login/**
2. Click "Try it out"
3. Use these credentials:
   ```json
   {
     "username": "hrmanager",
     "password": "password123"
   }
   ```
4. Click "Execute"
5. Copy the `access` token from the response

#### Authorize in Swagger
1. Click the **Authorize** button (🔒 icon at top right)
2. Enter: `Bearer <paste_your_access_token_here>`
3. Click "Authorize"
4. Click "Close"

#### Test Endpoints
Now you can test any endpoint! Try:
- **GET /api/employees/** - List all employees
- **GET /api/departments/** - List all departments
- **POST /api/employees/** - Create a new employee

## 📋 Test Accounts

| Username | Password | Role | What You Can Do |
|----------|----------|------|-----------------|
| hrmanager | password123 | HR Manager | Everything! |
| techmanager | password123 | Technical Manager | Full access to employees & departments |
| hrstaff | password123 | HR | Manage employees, view departments |
| developer1 | password123 | Developer | View only |

## 🔗 Important URLs

- **Swagger UI**: http://127.0.0.1:8000/swagger/
- **ReDoc**: http://127.0.0.1:8000/redoc/
- **Admin Panel**: http://127.0.0.1:8000/admin/

## 📖 Full Documentation

See [README.md](README.md) for complete API documentation.
