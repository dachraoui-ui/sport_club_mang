import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from club.models import ClassSession, Activity


@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def class_sessions(request):
    """
    GET: List all class sessions with optional filters
    POST: Create a new class session
    """
    if request.method == "GET":
        sessions = ClassSession.objects.select_related('activite').all()
        
        # Filter by activity
        activite_id = request.GET.get('activite_id')
        if activite_id:
            sessions = sessions.filter(activite_id=activite_id)
        
        # Filter by date
        date = request.GET.get('date')
        if date:
            sessions = sessions.filter(date=date)
        
        # Sort by date and time
        sort = request.GET.get('sort', 'date')
        if sort in ['date', '-date', 'heure_debut', '-heure_debut']:
            sessions = sessions.order_by(sort)
        
        data = []
        for session in sessions:
            data.append({
                "id": session.id,
                "activite": {
                    "id": session.activite.id,
                    "nom_act": session.activite.nom_act,
                    "code_act": session.activite.code_act
                },
                "date": session.date.isoformat(),
                "heure_debut": session.heure_debut.strftime('%H:%M'),
                "heure_fin": session.heure_fin.strftime('%H:%M')
            })
        
        return JsonResponse(data, safe=False)
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        # Validate required fields
        required_fields = ['activite_id', 'date', 'heure_debut', 'heure_fin']
        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"Missing required field: {field}"}, status=400)
        
        try:
            activite = Activity.objects.get(id=data['activite_id'])
        except Activity.DoesNotExist:
            return JsonResponse({"error": "Activity not found"}, status=404)
        
        # Create the class session
        session = ClassSession.objects.create(
            activite=activite,
            date=data['date'],
            heure_debut=data['heure_debut'],
            heure_fin=data['heure_fin']
        )
        
        return JsonResponse({"id": session.id, "success": True}, status=201)


@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def class_session_detail(request, session_id):
    """
    GET: Retrieve a single class session
    PUT: Update a class session
    DELETE: Delete a class session
    """
    try:
        session = ClassSession.objects.select_related('activite').get(id=session_id)
    except ClassSession.DoesNotExist:
        return JsonResponse({"error": "Class session not found"}, status=404)
    
    if request.method == "GET":
        return JsonResponse({
            "id": session.id,
            "activite": {
                "id": session.activite.id,
                "nom_act": session.activite.nom_act,
                "code_act": session.activite.code_act
            },
            "date": session.date.isoformat(),
            "heure_debut": session.heure_debut.strftime('%H:%M'),
            "heure_fin": session.heure_fin.strftime('%H:%M')
        })
    
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        # Update fields if provided
        if 'activite_id' in data:
            try:
                activite = Activity.objects.get(id=data['activite_id'])
                session.activite = activite
            except Activity.DoesNotExist:
                return JsonResponse({"error": "Activity not found"}, status=404)
        
        if 'date' in data:
            session.date = data['date']
        
        if 'heure_debut' in data:
            session.heure_debut = data['heure_debut']
        
        if 'heure_fin' in data:
            session.heure_fin = data['heure_fin']
        
        session.save()
        
        return JsonResponse({"success": True})
    
    if request.method == "DELETE":
        session.delete()
        return JsonResponse({"success": True})
