from django.shortcuts import render

from rest_framework.permissions import AllowAny, IsAdminUser

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import CustomUserSerializer
from .models import CustomUser
from .serializers import CustomTokenObtainPairSerializer

from rest_framework.generics import CreateAPIView, ListAPIView

# Create your views here.
class CreateUserView(CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
class UserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]