# Employee Management System - Frontend

This is the React-based frontend for the Employee Management System, built with Vite and Tailwind CSS.

## Features

- **Role-Based Access Control**: Different views and actions for Developer, Technical Manager, HR, and HR Manager.
- **Employee Management**: List, search, create, edit, and delete employees.
- **Department Management**: List, create, edit, and delete departments.
- **Authentication**: Secure JWT-based login with automatic token refresh.
- **Responsive Design**: Works on desktop and mobile.

## Prerequisites

- Node.js (v16 or higher)
- Python backend running (see root README)

## Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`

## Login Credentials

You can use the same users created in the backend:

- **HR Manager**: `hrmanager` / `password123`
- **Technical Manager**: `techmanager` / `password123`
- **HR Staff**: `hrstaff` / `password123`
- **Developer**: `developer1` / `password123`

## Project Structure

- `src/api`: API service layer with Axios interceptors
- `src/components`: Reusable UI components
- `src/context`: React Context (Auth)
- `src/pages`: Main page components
- `src/utils`: Helper functions and constants

## Role Permissions

| Role | Employees | Departments |
|------|-----------|-------------|
| **HR Manager** | Read, Create, Edit, Delete | Read, Create, Edit, Delete |
| **Tech Manager** | Read, Create, Edit, Delete | Read, Create, Edit, Delete |
| **HR Staff** | Read, Create, Edit, Delete | Read Only |
| **Developer** | Read Only | Read Only |
