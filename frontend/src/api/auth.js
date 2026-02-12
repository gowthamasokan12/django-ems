import axiosInstance from './axios';

/**
 * Login user
 * @param {string} username
 * @param {string} password
 * @returns {Promise}
 */
export const login = async (username, password) => {
    const response = await axiosInstance.post('/api/auth/login/', {
        username,
        password,
    });
    return response.data;
};

/**
 * Register new user
 * @param {Object} userData
 * @returns {Promise}
 */
export const register = async (userData) => {
    const response = await axiosInstance.post('/api/auth/register/', userData);
    return response.data;
};

/**
 * Refresh access token
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const refreshToken = async (refreshToken) => {
    const response = await axiosInstance.post('/api/auth/token/refresh/', {
        refresh: refreshToken,
    });
    return response.data;
};
