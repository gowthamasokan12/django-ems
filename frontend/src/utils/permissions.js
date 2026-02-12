import { ROLES } from './constants';

/**
 * Check if user can manage employees (create, update, delete)
 * @param {string} role - User role
 * @returns {boolean}
 */
export const canManageEmployees = (role) => {
    return [ROLES.HR, ROLES.TECHNICAL_MANAGER, ROLES.HR_MANAGER].includes(role);
};

/**
 * Check if user can manage departments (create, update, delete)
 * @param {string} role - User role
 * @returns {boolean}
 */
export const canManageDepartments = (role) => {
    return [ROLES.TECHNICAL_MANAGER, ROLES.HR_MANAGER].includes(role);
};

/**
 * Check if user has read-only access
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isReadOnly = (role) => {
    return role === ROLES.DEVELOPER;
};

/**
 * Check if user is HR Manager
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isHRManager = (role) => {
    return role === ROLES.HR_MANAGER;
};

/**
 * Check if user is Technical Manager or above
 * @param {string} role - User role
 * @returns {boolean}
 */
export const isTechnicalManager = (role) => {
    return [ROLES.TECHNICAL_MANAGER, ROLES.HR_MANAGER].includes(role);
};
