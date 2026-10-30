from rest_framework import serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings

from .models import EduUser
from .tokens import blacklist_edu_token


class EduUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduUser
        fields = [
            'id', 'email', 'display_name', 'role',
            'created_at', 'last_login_at',
        ]
        read_only_fields = ['id', 'role', 'created_at', 'last_login_at']


class DevLoginSerializer(serializers.Serializer):
    """DEBUG-only stand-in for the real eduID SAML assertion until BME grants SP registration."""
    eduid_subject = serializers.CharField()
    email = serializers.EmailField(required=False, allow_null=True)
    display_name = serializers.CharField(required=False, allow_null=True)


class EduTokenRefreshSerializer(TokenRefreshSerializer):
    """
    Stock TokenRefreshSerializer checks the refresh token's user against
    get_user_model() (Django's AUTH_USER_MODEL, i.e. auth.User with an integer
    id) before rotating. Our tokens carry an EduUser UUID, so that lookup
    throws. Same validate() logic, checked against EduUser instead.
    """

    def validate(self, attrs):
        refresh = self.token_class(attrs['refresh'])

        user_id = refresh.payload.get(api_settings.USER_ID_CLAIM)
        if user_id:
            try:
                EduUser.objects.get(pk=user_id)
            except EduUser.DoesNotExist:
                raise AuthenticationFailed(
                    self.error_messages['no_active_account'], 'no_active_account',
                )

        data = {'access': str(refresh.access_token)}

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                blacklist_edu_token(refresh)

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()

            data['refresh'] = str(refresh)

        return data
