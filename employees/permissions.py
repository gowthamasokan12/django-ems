from rest_framework import permissions
from employees.models import Employee


class IsHRManager(permissions.BasePermission):
    """Permission class for HR Manager role"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            return request.user.employee_profile.role == Employee.HR_MANAGER
        except Employee.DoesNotExist:
            return False


class IsTechnicalManager(permissions.BasePermission):
    """Permission class for Technical Manager role"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            employee = request.user.employee_profile
            return employee.role in [Employee.TECHNICAL_MANAGER, Employee.HR_MANAGER]
        except Employee.DoesNotExist:
            return False


class IsHR(permissions.BasePermission):
    """Permission class for HR role"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        try:
            employee = request.user.employee_profile
            return employee.role in [Employee.HR, Employee.HR_MANAGER]
        except Employee.DoesNotExist:
            return False


class CanManageEmployees(permissions.BasePermission):
    """
    Custom permission for employee management based on roles:
    - Developer: Read-only access
    - Technical Manager: Full CRUD access
    - HR: Full CRUD access to employees
    - HR Manager: Full CRUD access to all resources
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        try:
            employee = request.user.employee_profile
        except Employee.DoesNotExist:
            return False
        
        # Read-only access for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write access for HR, Technical Manager, and HR Manager
        return employee.role in [
            Employee.HR, 
            Employee.TECHNICAL_MANAGER, 
            Employee.HR_MANAGER
        ]


class CanManageDepartments(permissions.BasePermission):
    """
    Custom permission for department management based on roles:
    - Developer: Read-only access
    - Technical Manager: Full CRUD access
    - HR: Read-only access
    - HR Manager: Full CRUD access
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        try:
            employee = request.user.employee_profile
        except Employee.DoesNotExist:
            return False
        
        # Read-only access for all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write access for Technical Manager and HR Manager only
        return employee.role in [
            Employee.TECHNICAL_MANAGER, 
            Employee.HR_MANAGER
        ]
