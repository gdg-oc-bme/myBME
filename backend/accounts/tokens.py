from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.utils import datetime_from_epoch


def tokens_for_edu_user(user):
    """
    Builds a token pair for an EduUser without RefreshToken.for_user(), which
    assumes the user is an instance of settings.AUTH_USER_MODEL (it isn't —
    see accounts/models.py and accounts/authentication.py).
    """
    refresh = RefreshToken()
    refresh[api_settings.USER_ID_CLAIM] = str(user.pk)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


def blacklist_edu_token(token):
    """
    Equivalent to Token.blacklist(), minus its internal
    get_user_model().objects.get(id=...) lookup — that targets
    settings.AUTH_USER_MODEL (auth.User, integer id), which blows up on our
    EduUser UUID claims. OutstandingToken.user is nullable and only used for
    bookkeeping, so it's set to None here instead.
    """
    jti = token.payload[api_settings.JTI_CLAIM]
    exp = token.payload['exp']
    outstanding, _ = OutstandingToken.objects.get_or_create(
        jti=jti,
        defaults={
            'user': None,
            'created_at': token.current_time,
            'token': str(token),
            'expires_at': datetime_from_epoch(exp),
        },
    )
    BlacklistedToken.objects.get_or_create(token=outstanding)


def blacklist_edu_refresh_token(token_str):
    """blacklist_edu_token for a raw refresh token string (e.g. from a logout request)."""
    token = RefreshToken(token_str)  # raises TokenError if invalid/expired/already blacklisted
    blacklist_edu_token(token)
