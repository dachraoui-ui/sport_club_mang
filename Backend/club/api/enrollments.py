import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from club.models import Enrollment, Member, Activity


@csrf_exempt
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
