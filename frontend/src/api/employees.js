import axiosInstance from './axios';

/**
 * Get all employees with optional filters
 * @param {Object} params - Query parameters (page, search, department, role, is_active)
 * @returns {Promise}
 */
export const getEmployees = async (params = {}) => {
    const response = await axiosInstance.get('/api/employees/', { params });
    return response.data;
};

/**
 * Get single employee by ID
 * @param {number} id
 * @returns {Promise}
 */
export const getEmployee = async (id) => {
    const response = await axiosInstance.get(`/api/employees/${id}/`);
    return response.data;
};

/**
 * Get current user's employee profile
 * @returns {Promise}
 */
export const getCurrentUser = async () => {
    const response = await axiosInstance.get('/api/employees/me/');
    return response.data;
};

/**
 * Create new employee
 * @param {Object} data
 * @returns {Promise}
 */
export const createEmployee = async (data) => {
    const response = await axiosInstance.post('/api/employees/', data);
    return response.data;
};

/**
 * Update employee
 * @param {number} id
 * @param {Object} data
 * @returns {Promise}
 */
export const updateEmployee = async (id, data) => {
    const response = await axiosInstance.put(`/api/employees/${id}/`, data);
    return response.data;
};

/**
 * Partially update employee
 * @param {number} id
 * @param {Object} data
 * @returns {Promise}
 */
export const patchEmployee = async (id, data) => {
    const response = await axiosInstance.patch(`/api/employees/${id}/`, data);
    return response.data;
};

/**
 * Delete employee
 * @param {number} id
 * @returns {Promise}
 */
export const deleteEmployee = async (id) => {
    const response = await axiosInstance.delete(`/api/employees/${id}/`);
    return response.data;
};

/**
 * Get employees by department
 * @param {number} departmentId
 * @returns {Promise}
 */
export const getEmployeesByDepartment = async (departmentId) => {
    const response = await axiosInstance.get('/api/employees/by_department/', {
        params: { department_id: departmentId },
    });
    return response.data;
};
