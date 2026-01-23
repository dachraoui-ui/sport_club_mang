import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Login endpoint - accepts JSON body with username and password.
    Returns JWT tokens for authenticated admin users.
    """
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
    except json.JSONDecodeError:
        # Fallback to form data for backwards compatibility
        username = request.POST.get("username")
        password = request.POST.get("password")

    user = authenticate(request, username=username, password=password)

    if user and user.is_staff:
        login(request, user)
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            "success": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
            },
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        })

    return JsonResponse({"success": False, "error": "Invalid credentials or not an admin"}, status=401)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def admin_logout(request):
    """Logout endpoint - invalidates session"""
    logout(request)
    return JsonResponse({"success": True})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Returns the current authenticated user's information"""
    user = request.user
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "is_staff": user.is_staff,
    })
