import os

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
def health(request):
    return Response({'status': 'ok'})


# Static for now — two known services, one SSO-federated (Moodle) and one
# not (Neptun). Not worth a DB model until this list grows or needs to be
# admin-editable. Real URLs come from env so nothing is hardcoded/guessed.
LINKED_SERVICES = [
    {
        'name': 'Moodle',
        'url': os.environ.get('MOODLE_URL', ''),
        'sso': True,
    },
    {
        'name': 'Neptun',
        'url': os.environ.get('NEPTUN_URL', ''),
        'sso': False,
    },
]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    return Response({'services': LINKED_SERVICES})
