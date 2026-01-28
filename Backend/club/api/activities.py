import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from club.models import Activity
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, OpenApiResponse


@csrf_exempt
@extend_schema(
    summary="List or Create Activities",
    description="GET: Retrieve all activities (Public). POST: Create a new activity (Admin only).",
    parameters=[
        OpenApiParameter(
            name='search',
            description='Search activities by name (nom_act)',
            required=False,
            type=str
        ),
        OpenApiParameter(
            name='sort',
            description='Sort activities by capacity ("capacite" for ascending, "-capacite" for descending)',
            required=False,
            type=str,
            enum=['capacite', '-capacite']
        ),
    ],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'code_act': {'type': 'string', 'example': 'ACT001'},
                'nom_act': {'type': 'string', 'example': 'Yoga'},
                'tarif_mensuel': {'type': 'number', 'format': 'float', 'example': 50.0},
                'capacite': {'type': 'integer', 'example': 20},
            },
            'required': ['code_act', 'nom_act', 'tarif_mensuel', 'capacite']
        }
    },
    responses={
        200: OpenApiResponse(description="Success"),
        400: OpenApiResponse(description="Invalid data"),
        401: OpenApiResponse(description="Unauthorized"),
        403: OpenApiResponse(description="Forbidden")
    },
    tags=['Activities']
)
@api_view(['GET', 'POST'])
@permission_classes([]) # Allow public to LIST
def activities(request):
    if request.method == "GET":
        search = request.GET.get("search")
        sort = request.GET.get("sort")

        queryset = Activity.objects.all()

        # search by nom_act
        if search:
            queryset = queryset.filter(nom_act__icontains=search)

        # sort by capacite
        if sort == "capacite":
            queryset = queryset.order_by("capacite")
        elif sort == "-capacite":
            queryset = queryset.order_by("-capacite")

        # Return with proper photo URLs
        activities_list = []
        for activity in queryset:
            activities_list.append({
                "id": activity.id,
                "code_act": activity.code_act,
                "nom_act": activity.nom_act,
                "tarif_mensuel": float(activity.tarif_mensuel),
                "capacite": activity.capacite,
                "photo": activity.photo.url if activity.photo else None
            })
        return JsonResponse(activities_list, safe=False)

    if request.method == "POST":
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({"error": "Admin privileges required"}, status=403)

        # Handle both JSON and form data (for file uploads)
        if request.content_type and 'application/json' in request.content_type:
            try:
                data = json.loads(request.body)
                # Check if code already exists
                if Activity.objects.filter(code_act=data["code_act"]).exists():
                    return JsonResponse({"error": f"Le code activité '{data['code_act']}' existe déjà"}, status=400)
                activity = Activity.objects.create(
                    code_act=data["code_act"],
                    nom_act=data["nom_act"],
                    tarif_mensuel=data["tarif_mensuel"],
                    capacite=data["capacite"],
                )
                return JsonResponse({"id": activity.id, "success": True})
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON"}, status=400)
            except IntegrityError:
                return JsonResponse({"error": f"Le code activité existe déjà"}, status=400)
        else:
            # Form data with file upload support
            try:
                code_act = request.POST["code_act"]
                # Check if code already exists
                if Activity.objects.filter(code_act=code_act).exists():
                    return JsonResponse({"error": f"Le code activité '{code_act}' existe déjà"}, status=400)
                activity = Activity.objects.create(
                    code_act=code_act,
                    nom_act=request.POST["nom_act"],
                    tarif_mensuel=request.POST["tarif_mensuel"],
                    capacite=request.POST["capacite"],
                    photo=request.FILES.get("photo")
                )
                return JsonResponse({"id": activity.id, "success": True})
            except IntegrityError:
                return JsonResponse({"error": f"Le code activité existe déjà"}, status=400)


@csrf_exempt
@extend_schema(
    summary="Get, Update, or Delete Activity",
    description="GET: Retrieve activity details (Public). PUT/DELETE: Admin only.",
    responses={200: OpenApiResponse(description="Success")},
    tags=['Activities']
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([]) # Public GET, restricted others
def activity_detail(request, activity_id):
    try:
        activity = Activity.objects.get(id=activity_id)
    except Activity.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse({
            "id": activity.id,
            "code_act": activity.code_act,
            "nom_act": activity.nom_act,
            "tarif_mensuel": activity.tarif_mensuel,
            "capacite": activity.capacite,
            "photo": activity.photo.url if activity.photo else None
        })

    if request.method == "PUT":
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({"error": "Admin privileges required"}, status=403)

        # Handle both JSON and form data
        if request.content_type and 'application/json' in request.content_type:
            try:
                data = json.loads(request.body)
                activity.nom_act = data.get("nom_act", activity.nom_act)
                activity.tarif_mensuel = data.get("tarif_mensuel", activity.tarif_mensuel)
                activity.capacite = data.get("capacite", activity.capacite)
                if "code_act" in data:
                    activity.code_act = data["code_act"]
                activity.save()
                return JsonResponse({"success": True})
            except json.JSONDecodeError:
                return JsonResponse({"error": "Invalid JSON"}, status=400)
        else:
            # Form data with file upload support
            activity.nom_act = request.POST.get("nom_act", activity.nom_act)
            activity.tarif_mensuel = request.POST.get("tarif_mensuel", activity.tarif_mensuel)
            activity.capacite = request.POST.get("capacite", activity.capacite)

            if "photo" in request.FILES:
                activity.photo = request.FILES["photo"]

            activity.save()
            return JsonResponse({"success": True})

    if request.method == "DELETE":
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({"error": "Admin privileges required"}, status=403)

        activity.delete()
        return JsonResponse({"success": True})
