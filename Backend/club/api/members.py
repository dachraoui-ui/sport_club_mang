import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from club.models import Member
from django.db.models import Q


@csrf_exempt
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
            telephone=data["telephone"]
        )
        return JsonResponse({"id": member.id, "success": True})


@csrf_exempt
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
            "telephone": member.telephone
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
