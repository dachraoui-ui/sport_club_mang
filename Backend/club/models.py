from django.db import models
from django.core.validators import RegexValidator
from datetime import timedelta
from dateutil.relativedelta import relativedelta


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
    email = models.EmailField(unique=True, null=True, blank=True)
    actif = models.BooleanField(default=True)
    date_inscription = models.DateField(auto_now_add=True, null=True, blank=True)

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


class Subscription(models.Model):
    TYPE_CHOICES = [
        ('MONTHLY', 'Mensuel'),
        ('3_MONTHS', '3 Mois'),
        ('6_MONTHS', '6 Mois'),
        ('ANNUAL', 'Annuel'),
    ]
    
    membre = models.OneToOneField(Member, on_delete=models.CASCADE, related_name='subscription')
    type_abonnement = models.CharField(max_length=20, choices=TYPE_CHOICES)
    date_debut = models.DateField()
    date_fin = models.DateField()
    actif = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        # Auto-calculate date_fin based on type_abonnement
        if self.date_debut:
            if self.type_abonnement == 'MONTHLY':
                self.date_fin = self.date_debut + relativedelta(months=1)
            elif self.type_abonnement == '3_MONTHS':
                self.date_fin = self.date_debut + relativedelta(months=3)
            elif self.type_abonnement == '6_MONTHS':
                self.date_fin = self.date_debut + relativedelta(months=6)
            elif self.type_abonnement == 'ANNUAL':
                self.date_fin = self.date_debut + relativedelta(years=1)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.membre} - {self.get_type_abonnement_display()}"


class ClassSession(models.Model):
    activite = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='sessions')
    date = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()

    class Meta:
        ordering = ['date', 'heure_debut']
        unique_together = ('activite', 'date', 'heure_debut')

    def __str__(self):
        return f"{self.activite.nom_act} - {self.date} {self.heure_debut}-{self.heure_fin}"
