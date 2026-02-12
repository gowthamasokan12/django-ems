import axiosInstance from './axios';

/**
 * Get all departments
 * @param {Object} params - Query parameters
 * @returns {Promise}
 */
export const getDepartments = async (params = {}) => {
    const response = await axiosInstance.get('/api/departments/', { params });
    return response.data;
};

/**
 * Get single department by ID
 * @param {number} id
 * @returns {Promise}
 */
export const getDepartment = async (id) => {
    const response = await axiosInstance.get(`/api/departments/${id}/`);
    return response.data;
};

/**
 * Create new department
 * @param {Object} data
 * @returns {Promise}
 */
export const createDepartment = async (data) => {
    const response = await axiosInstance.post('/api/departments/', data);
    return response.data;
};

/**
 * Update department
 * @param {number} id
 * @param {Object} data
 * @returns {Promise}
 */
export const updateDepartment = async (id, data) => {
    const response = await axiosInstance.put(`/api/departments/${id}/`, data);
    return response.data;
};

/**
 * Delete department
 * @param {number} id
 * @returns {Promise}
 */
export const deleteDepartment = async (id) => {
    const response = await axiosInstance.delete(`/api/departments/${id}/`);
    return response.data;
};
