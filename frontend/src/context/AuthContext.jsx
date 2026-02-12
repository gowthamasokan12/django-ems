import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI } from '../api/auth';
import { getCurrentUser } from '../api/employees';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('accessToken');

            if (storedUser && accessToken) {
                try {
                    setUser(JSON.parse(storedUser));
                    // Optionally fetch fresh user data
                    const userData = await getCurrentUser();
                    const updatedUser = {
                        ...JSON.parse(storedUser),
                        ...userData,
                    };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                } catch (err) {
                    console.error('Failed to fetch user data:', err);
                    // Keep the stored user data if fetch fails
                    setUser(JSON.parse(storedUser));
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (username, password) => {
        try {
            setError(null);
            setLoading(true);

            const data = await loginAPI(username, password);

            // Store tokens
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);

            // Store user info
            const userInfo = {
                username: data.user.username,
                email: data.user.email,
                role: data.user.role,
                fullName: data.user.full_name,
            };
            localStorage.setItem('user', JSON.stringify(userInfo));
            setUser(userInfo);

            setLoading(false);
            return { success: true };
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
