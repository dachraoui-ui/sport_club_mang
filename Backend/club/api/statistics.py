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
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiResponse


@extend_schema(
    summary="Statistics Overview",
    description="Get an overview of club statistics including total members, most popular activity, and least popular activity.",
    responses={
        200: OpenApiResponse(
            description="Statistics overview",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        "total_members": 42,
                        "most_popular_activity": {
                            "nom": "Yoga",
                            "inscriptions": 15
                        },
                        "least_popular_activity": {
                            "nom": "Pilates",
                            "inscriptions": 3
                        }
                    }
                )
            ]
        ),
        401: OpenApiResponse(description="Unauthorized"),
        403: OpenApiResponse(description="Forbidden - Admin required")
    },
    tags=['Statistics']
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


@extend_schema(
    summary="Detailed Activity Statistics",
    description="Get detailed statistics for each activity including enrollments, capacity, and available spots.",
    responses={
        200: OpenApiResponse(
            description="Detailed activity statistics",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value=[
                        {
                            "code_act": "ACT001",
                            "nom_act": "Yoga",
                            "tarif_mensuel": 50.0,
                            "capacite": 20,
                            "nb_inscriptions": 15,
                            "places_disponibles": 5
                        },
                        {
                            "code_act": "ACT002",
                            "nom_act": "Pilates",
                            "tarif_mensuel": 45.0,
                            "capacite": 15,
                            "nb_inscriptions": 3,
                            "places_disponibles": 12
                        }
                    ]
                )
            ]
        ),
        401: OpenApiResponse(description="Unauthorized"),
        403: OpenApiResponse(description="Forbidden - Admin required")
    },
    tags=['Statistics']
)
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


@extend_schema(
    summary="Members Per Activity",
    description="Get a list of members grouped by activity.",
    responses={
        200: OpenApiResponse(
            description="Members grouped by activity",
            examples=[
                OpenApiExample(
                    'Success Response',
                    value={
                        "Yoga": [
                            {"id": 1, "nom": "Dupont", "prenom": "Jean"},
                            {"id": 2, "nom": "Martin", "prenom": "Marie"}
                        ],
                        "Pilates": [
                            {"id": 3, "nom": "Durand", "prenom": "Paul"}
                        ]
                    }
                )
            ]
        ),
        401: OpenApiResponse(description="Unauthorized"),
        403: OpenApiResponse(description="Forbidden - Admin required")
    },
    tags=['Statistics']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def stats_members_per_activity(request):
    """
    Liste des membres regroupés par activité.
    """
    return JsonResponse(members_per_activity())
