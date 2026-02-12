import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600';
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-700 text-white shadow-xl flex flex-col flex-shrink-0 h-full overflow-y-auto">
                <div className="p-6 border-b border-indigo-600">
                    <h1 className="text-2xl font-bold">EMS</h1>
                    <p className="text-xs text-indigo-200 mt-1">Employee Management</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/"
                        className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/')}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/employees"
                        className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/employees')}`}
                    >
                        Employees
                    </Link>
                    <Link
                        to="/departments"
                        className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/departments')}`}
                    >
                        Departments
                    </Link>
                </nav>

                <div className="p-4 border-t border-indigo-600">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold">
                            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium truncate w-32">{user?.fullName || user?.username}</p>
                            <p className="text-xs text-indigo-300 truncate w-32">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="bg-white shadow-sm p-4 sticky top-0 z-20 flex-shrink-0">
                    <div className="flex justify-between items-center max-w-7xl mx-auto">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {location.pathname === '/' ? 'Dashboard' :
                                location.pathname.startsWith('/employees') ? 'Employee Management' :
                                    location.pathname.startsWith('/departments') ? 'Department Management' : 'EMS'}
                        </h2>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
