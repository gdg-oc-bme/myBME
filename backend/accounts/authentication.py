from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings

from .models import EduUser


class EduUserJWTAuthentication(JWTAuthentication):
    """
    Resolves JWTs against accounts.EduUser instead of settings.AUTH_USER_MODEL,
    since EduUser (the eduID-identified app user) is deliberately not the Django
    auth model. See accounts/models.py.
    """

    def get_user(self, validated_token):
        user_id = validated_token.get(api_settings.USER_ID_CLAIM)
        if user_id is None:
            raise AuthenticationFailed('Token contained no recognizable user identification')
        try:
            return EduUser.objects.get(pk=user_id)
        except EduUser.DoesNotExist:
            raise AuthenticationFailed('User not found', code='user_not_found')
