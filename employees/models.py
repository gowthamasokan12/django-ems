from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Department(models.Model):
    """Department model for organizing employees"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Employee(models.Model):
    """Employee model with role-based access control"""
    
    # Role choices
    DEVELOPER = 'DEVELOPER'
    TECHNICAL_MANAGER = 'TECHNICAL_MANAGER'
    HR = 'HR'
    HR_MANAGER = 'HR_MANAGER'
    
    ROLE_CHOICES = [
        (DEVELOPER, 'Developer'),
        (TECHNICAL_MANAGER, 'Technical Manager'),
        (HR, 'HR'),
        (HR_MANAGER, 'HR Manager'),
    ]
    
    # Link to Django User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    
    # Personal information
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    
    # Employment details
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='employees')
    position = models.CharField(max_length=100)
    salary = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    hire_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    # Role for authorization
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=DEVELOPER)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.position}"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
