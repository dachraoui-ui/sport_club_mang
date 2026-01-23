from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from club.services.statistics import (
    total_members,
    activities_with_counts,
    most_popular_activity,
    least_popular_activity,
    members_per_activity
)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def stats_overview(request):
    """
    Vue d'ensemble des statistiques du club.
    """
    most_pop = most_popular_activity()
    least_pop = least_popular_activity()
    
    return JsonResponse({
        "total_members": total_members(),
        "most_popular_activity": {
            "nom": most_pop.nom_act,
            "inscriptions": most_pop.nb_inscriptions
        } if most_pop else None,
        "least_popular_activity": {
            "nom": least_pop.nom_act,
            "inscriptions": least_pop.nb_inscriptions
        } if least_pop else None,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def stats_activities(request):
    """
    Statistiques détaillées par activité.
    """
    activities = activities_with_counts()
    data = [
        {
            "code_act": act.code_act,
            "nom_act": act.nom_act,
            "tarif_mensuel": act.tarif_mensuel,
            "capacite": act.capacite,
            "nb_inscriptions": act.nb_inscriptions,
            "places_disponibles": act.capacite - act.nb_inscriptions
        }
        for act in activities
    ]
    return JsonResponse(data, safe=False)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def stats_members_per_activity(request):
    """
    Liste des membres regroupés par activité.
    """
    return JsonResponse(members_per_activity())
