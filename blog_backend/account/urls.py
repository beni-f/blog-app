from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import CreateUserView, CustomTokenObtainPairView


urlpatterns = [
    path('register/', CreateUserView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]