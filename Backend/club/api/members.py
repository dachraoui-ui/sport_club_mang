import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from club.models import Member
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample, OpenApiResponse


@csrf_exempt
@extend_schema(
    summary="List or Create Members",
    description="GET: Retrieve a list of all members with optional search and sort. POST: Create a new member.",
    parameters=[
        OpenApiParameter(
            name='search',
            description='Search members by first name (prenom) or last name (nom)',
            required=False,
            type=str
        ),
        OpenApiParameter(
            name='id',
            description='Search member by exact ID',
            required=False,
            type=int
        ),
        OpenApiParameter(
            name='sort',
            description='Sort members by age ("age" for ascending, "-age" for descending)',
            required=False,
            type=str,
            enum=['age', '-age']
        ),
    ],
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'nom': {'type': 'string', 'example': 'Dupont'},
                'prenom': {'type': 'string', 'example': 'Jean'},
                'age': {'type': 'integer', 'example': 25},
                'telephone': {'type': 'string', 'example': '12345678', 'description': 'Must be exactly 8 digits'},
            },
            'required': ['nom', 'prenom', 'age', 'telephone']
        }
    },
    responses={
        200: OpenApiResponse(
            description="List of members or newly created member",
            examples=[
                OpenApiExample(
                    'List Response',
                    value=[
                        {
                            "id": 1,
                            "nom": "Dupont",
                            "prenom": "Jean",
                            "age": 25,
                            "telephone": "12345678"
                        }
                    ]
                ),
                OpenApiExample(
                    'Create Response',
                    value={"id": 1, "success": True}
                )
            ]
        ),
        401: OpenApiResponse(description="Unauthorized - Authentication required"),
        403: OpenApiResponse(description="Forbidden - Admin privileges required")
    },
    tags=['Members']
)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def members(request):
   if request.method == "GET":
        search = request.GET.get("search")
        search_id = request.GET.get("id")  # Search by ID
        sort = request.GET.get("sort")

        queryset = Member.objects.all()

        # search by ID (exact match)
        if search_id:
            queryset = queryset.filter(id=search_id)
        # search by nom OR prénom
        elif search:
            
            queryset = queryset.filter(
                Q(nom__icontains=search) | Q(prenom__icontains=search)
            )

        # sort by age
        if sort == "age":
            queryset = queryset.order_by("age")
        elif sort == "-age":
            queryset = queryset.order_by("-age")

        return JsonResponse(list(queryset.values()), safe=False)

   if request.method == "POST":
        data = json.loads(request.body)
        member = Member.objects.create(
            nom=data["nom"],
            prenom=data["prenom"],
            age=data["age"],
            telephone=data["telephone"],
            email=data.get("email"),
            actif=data.get("actif", True)
        )
        return JsonResponse({"id": member.id, "success": True})


@csrf_exempt
@extend_schema(
    summary="Get, Update, or Delete Member",
    description="GET: Retrieve member details. PUT: Update member information. DELETE: Remove member.",
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'nom': {'type': 'string', 'example': 'Dupont'},
                'prenom': {'type': 'string', 'example': 'Jean'},
                'age': {'type': 'integer', 'example': 26},
                'telephone': {'type': 'string', 'example': '12345678'},
            }
        }
    },
    responses={
        200: OpenApiResponse(
            description="Member details or success confirmation",
            examples=[
                OpenApiExample(
                    'Get Response',
                    value={
                        "id": 1,
                        "nom": "Dupont",
                        "prenom": "Jean",
                        "age": 25,
                        "telephone": "12345678"
                    }
                ),
                OpenApiExample(
                    'Update/Delete Response',
                    value={"success": True}
                )
            ]
        ),
        404: OpenApiResponse(description="Member not found"),
        401: OpenApiResponse(description="Unauthorized"),
        403: OpenApiResponse(description="Forbidden - Admin required")
    },
    tags=['Members']
)
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def member_detail(request, member_id):
    try:
        member = Member.objects.get(id=member_id)
    except Member.DoesNotExist:
        return JsonResponse({"error": "Not found"}, status=404)

    if request.method == "GET":
        return JsonResponse({
            "id": member.id,
            "nom": member.nom,
            "prenom": member.prenom,
            "age": member.age,
            "telephone": member.telephone,
            "email": member.email,
            "actif": member.actif,
            "date_inscription": member.date_inscription.isoformat() if member.date_inscription else None
        })

    if request.method == "PUT":
        data = json.loads(request.body)
        for field, value in data.items():
            setattr(member, field, value)
        member.save()
        return JsonResponse({"success": True})

    if request.method == "DELETE":
        member.delete()
        return JsonResponse({"success": True})
