from django.conf import settings
from django.db import models


class Profile(models.Model):
    """Domain-specific data for a Django user. One-to-one and always present —
    see the post_save signal below — so "no profile for this user" can't happen.
    """

    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        PROFESSOR = 'professor', 'Professor'
        ADMIN = 'admin', 'Admin'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile'
    )
    neptun_code = models.CharField(max_length=20, unique=True, blank=True, null=True)
    major = models.CharField(max_length=100, blank=True)
    oidc_sub = models.CharField(
        max_length=255, blank=True, help_text='OIDC subject identifier from identity provider'
    )
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Profile({self.user.username})'
