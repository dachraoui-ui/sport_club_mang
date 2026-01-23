from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from club.api.auth import admin_login, admin_logout, get_current_user
from club.api.members import members, member_detail
from club.api.activities import activities, activity_detail
from club.api.enrollments import enrollments, enrollment_detail
from club.api.statistics import stats_overview, stats_activities, stats_members_per_activity

urlpatterns = [
    # JWT Token endpoints
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    
    # Legacy auth endpoints (still available)
    path("auth/login/", admin_login),
    path("auth/logout/", admin_logout),
    path("auth/me/", get_current_user),

    path("members/", members),
    path("members/<int:member_id>/", member_detail),

    path("activities/", activities),
    path("activities/<int:activity_id>/", activity_detail),

    path("enrollments/", enrollments),
    path("enrollments/<int:enrollment_id>/", enrollment_detail),

    # Statistics endpoints
    path("stats/", stats_overview),
    path("stats/activities/", stats_activities),
    path("stats/members-per-activity/", stats_members_per_activity),
]
