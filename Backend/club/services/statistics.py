from django.db.models import Count
from club.models import Member, Activity, Enrollment


def total_members():
    # Retourne simplement le nombre total de membres inscrits dans le club
    return Member.objects.count()


def activities_with_counts():
    """
    Pour chaque activité, on calcule le nombre d'inscriptions.
    Django fait automatiquement les jointures SQL.
    """
    return (
        Activity.objects
        .annotate(nb_inscriptions=Count("enrollment"))
        .order_by("-nb_inscriptions")
    )


def most_popular_activity():
    # L'activité la plus populaire est celle avec le plus d'inscriptions
    return activities_with_counts().first()


def least_popular_activity():
    # L'activité la moins populaire est celle avec le moins d'inscriptions
    return activities_with_counts().last()


def members_per_activity():
    """
    Regroupe les membres par activité.
    Le résultat sera une structure facile.
    Exemple :
    {
        "Gym": [{nom, prenom}, ...],
        "Tennis": [...]
    }
    """
    result = {}

    # On récupère toutes les inscriptions avec les infos du membre et de l'activité
    enrollments = (
        Enrollment.objects
        .select_related("membre", "activite")
        .order_by("activite__nom_act")
    )

    for enrollment in enrollments:
        activity_name = enrollment.activite.nom_act

        # Si l'activité n'existe pas encore dans le dictionnaire, on l'initialise
        if activity_name not in result:
            result[activity_name] = []

        # On ajoute le membre inscrit à cette activité
        result[activity_name].append({
            "nom": enrollment.membre.nom,
            "prenom": enrollment.membre.prenom
        })

    return result
