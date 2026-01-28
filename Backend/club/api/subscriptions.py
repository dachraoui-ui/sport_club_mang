from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from club.models import Subscription, Member
import json
from datetime import datetime


@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def subscriptions(request):
    """
    GET /api/subscriptions/ - List all subscriptions
    POST /api/subscriptions/ - Create new subscription
    """
    if request.method == "GET":
        subs = Subscription.objects.select_related('membre').all()
        
        # Optional filtering by member_id
        member_id = request.GET.get('member_id')
        if member_id:
            subs = subs.filter(membre_id=member_id)
        
        # Optional filtering by actif status
        actif = request.GET.get('actif')
        if actif is not None:
            subs = subs.filter(actif=actif.lower() == 'true')
        
        data = [{
            'id': sub.id,
            'membre_id': sub.membre.id,
            'membre_nom': f"{sub.membre.prenom} {sub.membre.nom}",
            'type_abonnement': sub.type_abonnement,
            'type_abonnement_display': sub.get_type_abonnement_display(),
            'date_debut': sub.date_debut.isoformat(),
            'date_fin': sub.date_fin.isoformat(),
            'actif': sub.actif
        } for sub in subs]
        
        return JsonResponse(data, safe=False)
    
    elif request.method == "POST":
        data = json.loads(request.body)
        
        # Validate required fields
        if 'membre_id' not in data or 'type_abonnement' not in data or 'date_debut' not in data:
            return JsonResponse({
                'error': 'membre_id, type_abonnement, and date_debut are required'
            }, status=400)
        
        try:
            membre = Member.objects.get(id=data['membre_id'])
        except Member.DoesNotExist:
            return JsonResponse({'error': 'Member not found'}, status=404)
        
        # Check if member already has a subscription
        if hasattr(membre, 'subscription'):
            return JsonResponse({
                'error': 'Member already has a subscription. Use PUT to update.'
            }, status=400)
        
        # Validate type_abonnement
        valid_types = ['MONTHLY', '3_MONTHS', '6_MONTHS', 'ANNUAL']
        if data['type_abonnement'] not in valid_types:
            return JsonResponse({
                'error': f'Invalid type_abonnement. Must be one of: {", ".join(valid_types)}'
            }, status=400)
        
        # Parse date_debut
        try:
            date_debut = datetime.strptime(data['date_debut'], '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({
                'error': 'Invalid date_debut format. Use YYYY-MM-DD'
            }, status=400)
        
        # Create subscription (date_fin will be auto-calculated)
        subscription = Subscription.objects.create(
            membre=membre,
            type_abonnement=data['type_abonnement'],
            date_debut=date_debut,
            actif=data.get('actif', True)
        )
        
        return JsonResponse({
            'id': subscription.id,
            'date_fin': subscription.date_fin.isoformat()
        }, status=201)


@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def subscription_detail(request, subscription_id):
    """
    GET /api/subscriptions/{id}/ - Get single subscription
    PUT /api/subscriptions/{id}/ - Update subscription
    DELETE /api/subscriptions/{id}/ - Delete subscription
    """
    try:
        subscription = Subscription.objects.select_related('membre').get(id=subscription_id)
    except Subscription.DoesNotExist:
        return JsonResponse({'error': 'Subscription not found'}, status=404)
    
    if request.method == "GET":
        data = {
            'id': subscription.id,
            'membre_id': subscription.membre.id,
            'membre_nom': f"{subscription.membre.prenom} {subscription.membre.nom}",
            'type_abonnement': subscription.type_abonnement,
            'type_abonnement_display': subscription.get_type_abonnement_display(),
            'date_debut': subscription.date_debut.isoformat(),
            'date_fin': subscription.date_fin.isoformat(),
            'actif': subscription.actif
        }
        return JsonResponse(data)
    
    elif request.method == "PUT":
        data = json.loads(request.body)
        
        # Update type_abonnement if provided
        if 'type_abonnement' in data:
            valid_types = ['MONTHLY', '3_MONTHS', '6_MONTHS', 'ANNUAL']
            if data['type_abonnement'] not in valid_types:
                return JsonResponse({
                    'error': f'Invalid type_abonnement. Must be one of: {", ".join(valid_types)}'
                }, status=400)
            subscription.type_abonnement = data['type_abonnement']
        
        # Update date_debut if provided
        if 'date_debut' in data:
            try:
                subscription.date_debut = datetime.strptime(data['date_debut'], '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({
                    'error': 'Invalid date_debut format. Use YYYY-MM-DD'
                }, status=400)
        
        # Update actif if provided
        if 'actif' in data:
            subscription.actif = data['actif']
        
        # Save (will auto-recalculate date_fin)
        subscription.save()
        
        return JsonResponse({
            'success': True,
            'date_fin': subscription.date_fin.isoformat()
        })
    
    elif request.method == "DELETE":
        subscription.delete()
        return JsonResponse({'success': True})
