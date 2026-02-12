from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Employee, Department
from .serializers import (
    EmployeeSerializer, 
    EmployeeCreateUpdateSerializer,
    DepartmentSerializer,
    UserRegistrationSerializer
)
from .permissions import CanManageEmployees, CanManageDepartments


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Department CRUD operations
    
    Permissions:
    - All authenticated users: Read-only access
    - Technical Manager & HR Manager: Full CRUD access
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [CanManageDepartments]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Employee CRUD operations
    
    Permissions:
    - All authenticated users: Read-only access
    - HR, Technical Manager & HR Manager: Full CRUD access
    
    Filtering: department, role, is_active
    Search: first_name, last_name, email, position
    """
    queryset = Employee.objects.select_related('department', 'user').all()
    permission_classes = [CanManageEmployees]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['department', 'role', 'is_active']
    search_fields = ['first_name', 'last_name', 'email', 'position']
    ordering_fields = ['first_name', 'last_name', 'hire_date', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EmployeeCreateUpdateSerializer
        return EmployeeSerializer
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's employee profile"""
        try:
            employee = request.user.employee_profile
            serializer = self.get_serializer(employee)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'detail': 'Employee profile not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def by_department(self, request):
        """Get employees grouped by department"""
        department_id = request.query_params.get('department_id')
        if department_id:
            employees = self.queryset.filter(department_id=department_id, is_active=True)
            serializer = self.get_serializer(employees, many=True)
            return Response(serializer.data)
        return Response({'detail': 'department_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
