from django.conf import settings
from django.http import Http404
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView

from .models import EduUser
from .serializers import DevLoginSerializer, EduTokenRefreshSerializer, EduUserSerializer
from .tokens import blacklist_edu_refresh_token, tokens_for_edu_user


class AuthThrottle(AnonRateThrottle):
    scope = 'auth'


class DevLoginView(APIView):
    """
    DEBUG-only stand-in for the real eduID SSO callback. Upserts an EduUser by
    eduid_subject and returns a token pair, so the API is testable end to end
    before BME grants SAML SP registration. Disabled outside DEBUG.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthThrottle]

    def post(self, request):
        if not settings.DEBUG:
            raise Http404
        serializer = DevLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user, _ = EduUser.objects.get_or_create(
            eduid_subject=data['eduid_subject'],
            defaults={
                'email': data.get('email'),
                'display_name': data.get('display_name'),
            },
        )
        user.last_login_at = timezone.now()
        user.save(update_fields=['last_login_at'])
        return Response({'user': EduUserSerializer(user).data, **tokens_for_edu_user(user)})


class RefreshView(TokenRefreshView):
    serializer_class = EduTokenRefreshSerializer


class LogoutView(APIView):
    def post(self, request):
        refresh = request.data.get('refresh')
        if not refresh:
            return Response({'detail': 'refresh is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            blacklist_edu_refresh_token(refresh)
        except TokenError:
            return Response({'detail': 'invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = EduUserSerializer

    def get_object(self):
        return self.request.user


class BmeSsoStubView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(
            {
                'detail': (
                    'BME eduID SSO is not wired up yet. This endpoint will become '
                    'the SAML2 ACS once BME grants SP registration (metadata, '
                    'entityID, certs). Use /api/auth/dev-login/ in DEBUG for now.'
                ),
            },
            status=status.HTTP_501_NOT_IMPLEMENTED,
        )
