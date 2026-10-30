import uuid

from django.db import models


class EduUser(models.Model):
    """
    Maps onto the `users` table owned by Alembic (see backend/alembic/versions).
    Not Django's AUTH_USER_MODEL — no password column exists; identity comes
    entirely from BME's eduID SSO via eduid_subject. Django's own auth.User is
    still used separately for /admin/ staff login.
    """

    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        PROFESSOR = 'professor', 'Professor'
        ADMIN = 'admin', 'Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    eduid_subject = models.CharField(max_length=255, unique=True)
    email = models.EmailField(null=True, blank=True)
    display_name = models.CharField(max_length=150, null=True, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STUDENT)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'users'

    def __str__(self):
        return self.display_name or self.eduid_subject

    # Minimal interface DRF/SimpleJWT expect from a "user" object.
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_active(self):
        return True
