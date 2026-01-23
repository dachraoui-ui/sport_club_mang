from django.db import models
from django.core.validators import RegexValidator


# table de membre 
# avec les champs : nom , prenom , age et telephone 
# id est generé automatiquement avec django comme un PK
class Member(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    age = models.IntegerField()
    telephone = models.CharField(
        max_length=8,
        validators=[
            RegexValidator(
                regex=r'^\d{8}$',
                message='Le numéro de téléphone doit contenir exactement 8 chiffres.',
                code='invalid_telephone'
            )
        ]
    )

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Activity(models.Model):
    code_act = models.CharField(max_length=20, unique=True)
    nom_act = models.CharField(max_length=100)
    tarif_mensuel = models.FloatField()
    capacite = models.IntegerField()
    photo = models.ImageField(upload_to='activities/', null=True, blank=True)

    def __str__(self):
        return self.nom_act


class Enrollment(models.Model):
    membre = models.ForeignKey(Member, on_delete=models.CASCADE)
    activite = models.ForeignKey(Activity, on_delete=models.CASCADE)
    date_inscription = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('membre', 'activite')
