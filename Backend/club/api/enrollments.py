import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from club.models import Enrollment, Member, Activity
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse


@csrf_exempt
@extend_schema(
    summary="List or Create Enrollments",
    description="GET: Retrieve all enrollments with member and activity details. POST: Create a new enrollment (checks for duplicates and capacity).",
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'membre_id': {'type': 'integer', 'example': 1},
                'activite_id': {'type': 'integer', 'example': 1},
            },
            'required': ['membre_id', 'activite_id']
        }
    },
    responses={
        200: OpenApiResponse(
            description="List of enrollments or newly created enrollment",
            examples=[
                OpenApiExample(
                    'List Response',
                    value=[
                        {
                            "id": 1,
                            "membre_id": 1,
                            "membre_nom": "Dupont",
                            "membre_prenom": "Jean",
                            "activite_id": 1,
                            "activite_nom": "Yoga",
                            "date_inscription": "2024-01-15"
                        }
                    ]
                ),
                OpenApiExample(
                    'Create Response',
                    value={"id": 1, "success": True}
                )
            ]
        ),
        400: OpenApiResponse(
            description="Bad request - Member already enrolled or activity is full",
            examples=[
                OpenApiExample(
                    'Already Enrolled',
                    value={"error": "Member already enrolled in this activity"}
                ),
                OpenApiExample(
                    'Activity Full',
                    value={"error": "Activity is full"}
                )
            ]
        ),
        404: OpenApiResponse(description="Member or Activity not found"),
        401: OpenApiResponse(description="Unauthorized"),
        403: OpenApiResponse(description="Forbidden - Admin required")
    },
    tags=['Enrollments']
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def enrollments(request):
    if request.method == "GET":
        data = Enrollment.objects.select_related("membre", "activite").values(
            "id",
            "membre__id",
            "membre__nom",
            "membre__prenom",
            "activite__id",
            "activite__nom_act",
            "date_inscription"
        )
        # Transform the data for better frontend consumption
        result = [
            {
                "id": item["id"],
                "membre_id": item["membre__id"],
                "membre_nom": item["membre__nom"],
                "membre_prenom": item["membre__prenom"],
                "activite_id": item["activite__id"],
                "activite_nom": item["activite__nom_act"],
                "date_inscription": item["date_inscription"]
            }
            for item in data
        ]
        return JsonResponse(result, safe=False)

    if request.method == "POST":
        data = json.loads(request.body)

        try:
            membre = Member.objects.get(id=data["membre_id"])
        except Member.DoesNotExist:
            return JsonResponse({"error": "Member not found"}, status=404)
        
        try:
            activite = Activity.objects.get(id=data["activite_id"])
        except Activity.DoesNotExist:
            return JsonResponse({"error": "Activity not found"}, status=404)

        # Check if already enrolled
        if Enrollment.objects.filter(membre=membre, activite=activite).exists():
            return JsonResponse({"error": "Member already enrolled in this activity"}, status=400)

        # capacity check
        count = Enrollment.objects.filter(activite=activite).count()
        if count >= activite.capacite:
            return JsonResponse({"error": "Activity is full"}, status=400)

        enrollment = Enrollment.objects.create(
            membre=membre,
            activite=activite
        )
        return JsonResponse({"id": enrollment.id, "success": True})


@csrf_exempt
@extend_schema(
    summary="Get, Update, or Delete Enrollment",
    description="GET: Retrieve enrollment details. PUT: Update enrollment (change member or activity, validates capacity). DELETE: Remove enrollment.",
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'membre_id': {'type': 'integer', 'example': 2, 'description': 'Optional - Update member'},
                'activite_id': {'type': 'integer', 'example': 2, 'description': 'Optional - Update activity'},
            }
        }
    },
    responses={
        200: OpenApiResponse(
            description="Enrollment details or success confirmation",
            examples=[
                OpenApiExample(
                    'Get Response',
                    value={
                        "id": 1,
                        "membre_id": 1,
                        "membre_nom": "Dupont",
                        "membre_prenom": "Jean",
                        "activite_id": 1,
                        "activite_nom": "Yoga",
                        "date_inscription": "2024-01-15"
                    }
                ),
                OpenApiExample(
                    'Update/Delete Response',
                    value={"success": True}
                )
            ]
        ),
        404: OpenApiResponse(description="Enrollment, Member, or Activity not found"),
        400: OpenApiResponse(description="Activity is full"),
        401: OpenApiResponse(description="Unauthorized"),
        403: OpenApiResponse(description="Forbidden - Admin required")
    },
    tags=['Enrollments']
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def enrollment_detail(request, enrollment_id):
    try:
        enrollment = Enrollment.objects.get(id=enrollment_id)
    except Enrollment.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse({
            "id": enrollment.id,
            "membre_id": enrollment.membre.id,
            "membre_nom": enrollment.membre.nom,
            "membre_prenom": enrollment.membre.prenom,
            "activite_id": enrollment.activite.id,
            "activite_nom": enrollment.activite.nom_act,
            "date_inscription": enrollment.date_inscription
        })

    if request.method == "PUT":
        data = json.loads(request.body)
        
        # Update member if provided
        if "membre_id" in data:
            try:
                new_membre = Member.objects.get(id=data["membre_id"])
                enrollment.membre = new_membre
            except Member.DoesNotExist:
                return JsonResponse({"error": "Member not found"}, status=404)
        
        # Update activity if provided
        if "activite_id" in data:
            try:
                new_activite = Activity.objects.get(id=data["activite_id"])
            except Activity.DoesNotExist:
                return JsonResponse({"error": "Activity not found"}, status=404)
            
            # Check capacity for new activity
            count = Enrollment.objects.filter(activite=new_activite).exclude(id=enrollment_id).count()
            if count >= new_activite.capacite:
                return JsonResponse({"error": "Activity is full"}, status=400)
            enrollment.activite = new_activite
        
        enrollment.save()
        return JsonResponse({"success": True})

    if request.method == "DELETE":
        enrollment.delete()
        return JsonResponse({"success": True})
