from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from employees.models import Employee, Department
from datetime import date


class Command(BaseCommand):
    help = 'Populate database with sample data for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')
        
        # Create departments
        departments_data = [
            {'name': 'Engineering', 'description': 'Software development and engineering team'},
            {'name': 'Human Resources', 'description': 'HR and talent management'},
            {'name': 'Sales', 'description': 'Sales and business development'},
            {'name': 'Marketing', 'description': 'Marketing and communications'},
        ]
        
        departments = {}
        for dept_data in departments_data:
            dept, created = Department.objects.get_or_create(
                name=dept_data['name'],
                defaults={'description': dept_data['description']}
            )
            departments[dept_data['name']] = dept
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created department: {dept.name}'))
        
        # Create sample users and employees
        employees_data = [
            {
                'username': 'hrmanager',
                'email': 'hrmanager@company.com',
                'password': 'password123',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'phone': '555-0101',
                'department': 'Human Resources',
                'position': 'HR Manager',
                'salary': 85000,
                'hire_date': date(2020, 1, 15),
                'role': Employee.HR_MANAGER,
            },
            {
                'username': 'techmanager',
                'email': 'techmanager@company.com',
                'password': 'password123',
                'first_name': 'Michael',
                'last_name': 'Chen',
                'phone': '555-0102',
                'department': 'Engineering',
                'position': 'Technical Manager',
                'salary': 95000,
                'hire_date': date(2019, 3, 10),
                'role': Employee.TECHNICAL_MANAGER,
            },
            {
                'username': 'hrstaff',
                'email': 'hrstaff@company.com',
                'password': 'password123',
                'first_name': 'Emily',
                'last_name': 'Davis',
                'phone': '555-0103',
                'department': 'Human Resources',
                'position': 'HR Specialist',
                'salary': 65000,
                'hire_date': date(2021, 6, 1),
                'role': Employee.HR,
            },
            {
                'username': 'developer1',
                'email': 'developer1@company.com',
                'password': 'password123',
                'first_name': 'Alex',
                'last_name': 'Rodriguez',
                'phone': '555-0104',
                'department': 'Engineering',
                'position': 'Senior Developer',
                'salary': 90000,
                'hire_date': date(2020, 9, 15),
                'role': Employee.DEVELOPER,
            },
            {
                'username': 'developer2',
                'email': 'developer2@company.com',
                'password': 'password123',
                'first_name': 'Jessica',
                'last_name': 'Martinez',
                'phone': '555-0105',
                'department': 'Engineering',
                'position': 'Junior Developer',
                'salary': 70000,
                'hire_date': date(2022, 2, 1),
                'role': Employee.DEVELOPER,
            },
        ]
        
        for emp_data in employees_data:
            # Check if user already exists
            if User.objects.filter(username=emp_data['username']).exists():
                self.stdout.write(self.style.WARNING(f'User {emp_data["username"]} already exists, skipping...'))
                continue
            
            # Create user
            user = User.objects.create_user(
                username=emp_data['username'],
                email=emp_data['email'],
                password=emp_data['password']
            )
            
            # Create employee
            employee = Employee.objects.create(
                user=user,
                first_name=emp_data['first_name'],
                last_name=emp_data['last_name'],
                email=emp_data['email'],
                phone=emp_data['phone'],
                department=departments[emp_data['department']],
                position=emp_data['position'],
                salary=emp_data['salary'],
                hire_date=emp_data['hire_date'],
                role=emp_data['role']
            )
            
            self.stdout.write(self.style.SUCCESS(
                f'Created employee: {employee.full_name} ({emp_data["username"]}) - {emp_data["role"]}'
            ))
        
        self.stdout.write(self.style.SUCCESS('\n=== Sample Data Created Successfully ==='))
        self.stdout.write('\nTest Accounts:')
        self.stdout.write('1. HR Manager: hrmanager / password123')
        self.stdout.write('2. Technical Manager: techmanager / password123')
        self.stdout.write('3. HR Staff: hrstaff / password123')
        self.stdout.write('4. Developer 1: developer1 / password123')
        self.stdout.write('5. Developer 2: developer2 / password123')
