from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from employees.serializers import UserRegistrationSerializer

User = get_user_model()


class UserRegistrationView(generics.CreateAPIView):
    """
    User registration endpoint
    Creates a new user and employee profile
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'User registered successfully',
            'username': user.username,
            'email': user.email
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view that returns user info along with tokens
    """
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Get the username from the request data
            username = request.data.get('username')
            try:
                user = User.objects.get(username=username)
                employee = user.employee_profile
                response.data['user'] = {
                    'username': user.username,
                    'email': user.email,
                    'role': employee.role,
                    'full_name': employee.full_name
                }
            except (User.DoesNotExist, AttributeError):
                # If user doesn't exist or has no employee profile, just return tokens
                pass
        
        return response
