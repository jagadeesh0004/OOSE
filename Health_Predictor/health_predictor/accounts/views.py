from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from .models import User
from rest_framework.views import APIView 
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

# @api_view(['GET'])
# def api_root(request, format=None):
#     return Response({
#         'register': reverse('register', request=request, format=format),
#         'login': reverse('login', request=request, format=format),
#         'profile': reverse('profile', request=request, format=format),
#         'logout': reverse('logout', request=request, format=format),
#     })


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        })

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    
    def post(self, request):
        """Handle POST requests"""
        return self.perform_logout(request)
    
    def get(self, request):
        """Handle GET requests the same as POST"""
        return self.perform_logout(request)
    
    def perform_logout(self, request):
        """Common logout logic"""
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Logout successful'})
        except:
            return Response({'error': 'Logout failed'}, status=400)