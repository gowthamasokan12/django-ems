from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employee, Department


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model"""
    employee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'employee_count', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def get_employee_count(self, obj):
        return obj.employees.filter(is_active=True).count()


class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee model with nested department info"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.CharField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'username', 'first_name', 'last_name', 'full_name', 
            'email', 'phone', 'department', 'department_name', 
            'position', 'salary', 'hire_date', 'is_active', 'role',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class EmployeeCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating employees"""
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'username', 'password', 'first_name', 'last_name', 
            'email', 'phone', 'department', 'position', 'salary', 
            'hire_date', 'is_active', 'role'
        ]
    
    def validate(self, data):
        email = data.get('email')
        username = data.get('username', email)
        
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "A user with this username/email already exists."})
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})
            
        return data

    def create(self, validated_data):
        username = validated_data.pop('username', validated_data.get('email'))
        password = validated_data.pop('password', 'defaultpass123')
        
        # Create user
        try:
            user = User.objects.create_user(
                username=username,
                email=validated_data['email'],
                password=password
            )
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Failed to create user: {str(e)}"})
        
        # Create employee
        employee = Employee.objects.create(user=user, **validated_data)
        return employee
    
    def update(self, instance, validated_data):
        # Remove username and password if provided (not updating user here)
        validated_data.pop('username', None)
        validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), required=False, allow_null=True)
    position = serializers.CharField(required=True)
    salary = serializers.DecimalField(max_digits=10, decimal_places=2, required=True)
    hire_date = serializers.DateField(required=True)
    role = serializers.ChoiceField(choices=Employee.ROLE_CHOICES, default=Employee.DEVELOPER)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 
                  'first_name', 'last_name', 'phone', 'department', 
                  'position', 'salary', 'hire_date', 'role']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        
        # Extract employee-specific fields
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        phone = validated_data.pop('phone', '')
        department = validated_data.pop('department', None)
        position = validated_data.pop('position')
        salary = validated_data.pop('salary')
        hire_date = validated_data.pop('hire_date')
        role = validated_data.pop('role', Employee.DEVELOPER)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create employee profile
        employee = Employee.objects.create(
            user=user,
            first_name=first_name,
            last_name=last_name,
            email=validated_data['email'],
            phone=phone,
            department=department,
            position=position,
            salary=salary,
            hire_date=hire_date,
            role=role
        )
        
        return user
