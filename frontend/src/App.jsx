import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/Employees/EmployeeList';
import EmployeeForm from './pages/Employees/EmployeeForm';
import DepartmentList from './pages/Departments/DepartmentList';
import { canManageEmployees } from './utils/permissions';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/employees" element={
                        <ProtectedRoute>
                            <EmployeeList />
                        </ProtectedRoute>
                    } />

                    <Route path="/employees/new" element={
                        <ProtectedRoute requiredPermission={canManageEmployees}>
                            <EmployeeForm />
                        </ProtectedRoute>
                    } />

                    <Route path="/employees/:id/edit" element={
                        <ProtectedRoute requiredPermission={canManageEmployees}>
                            <EmployeeForm />
                        </ProtectedRoute>
                    } />

                    <Route path="/departments" element={
                        <ProtectedRoute>
                            <DepartmentList />
                        </ProtectedRoute>
                    } />

                    {/* Catch all redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
