from django.contrib import admin
from employees.models import Employee, Department

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'position', 'department', 'role', 'is_active', 'hire_date']
    list_filter = ['role', 'is_active', 'department']
    search_fields = ['first_name', 'last_name', 'email', 'position']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
