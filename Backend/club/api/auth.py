import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse


@csrf_exempt
@extend_schema(
    summary="Admin Login (Legacy)",
    description="Login endpoint for admin users. Returns JWT tokens and user information. This is a legacy endpoint - prefer using /auth/token/ for JWT authentication.",
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'username': {'type': 'string', 'example': 'admin'},
                'password': {'type': 'string', 'example': 'password123'},
            },
            'required': ['username', 'password']
        }
    },
    responses={
        200: OpenApiResponse(
            description="Login successful",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        "success": True,
                        "user": {
                            "id": 1,
                            "username": "admin",
                            "email": "admin@example.com",
                            "is_staff": True
                        },
                        "tokens": {
                            "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
                            "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
                        }
                    }
                )
            ]
        ),
        401: OpenApiResponse(description="Invalid credentials or not an admin")
    },
    tags=['Authentication']
)
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


@extend_schema(
    summary="Admin Logout",
    description="Logout endpoint - invalidates the current session. Works with session authentication.",
    responses={
        200: OpenApiResponse(
            description="Logout successful",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={"success": True}
                )
            ]
        )
    },
    tags=['Authentication']
)
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def admin_logout(request):
    """Logout endpoint - invalidates session"""
    logout(request)
    return JsonResponse({"success": True})


@extend_schema(
    summary="Get Current User",
    description="Returns the current authenticated user's information. Requires authentication token.",
    responses={
        200: OpenApiResponse(
            description="User information",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        "id": 1,
                        "username": "admin",
                        "email": "admin@example.com",
                        "is_staff": True
                    }
                )
            ]
        ),
        401: OpenApiResponse(description="Unauthorized - Authentication credentials not provided")
    },
    tags=['Authentication']
)
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
