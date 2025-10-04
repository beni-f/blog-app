from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError, Serializer

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser

class CustomUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'email', 'bio']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = CustomUser(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
class CustomTokenObtainPairSerializer(Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("identifier")
        password = attrs.get("password")

        # Resolve identifier to username
        try:
            user_obj = CustomUser.objects.get(email=identifier)
            username = user_obj.username
        except CustomUser.DoesNotExist:
            username = identifier

        user = authenticate(username=username, password=password)
        if not user:
            raise ValidationError("No active account found with the given credentials")

        
        refresh = RefreshToken.for_user(user)
        data = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "bio": getattr(user, "bio", "")
            }
        }
        return data