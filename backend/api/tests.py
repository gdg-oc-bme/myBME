from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class HealthTests(APITestCase):
    def test_health_is_public_and_ok(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})


class DashboardTests(APITestCase):
    def test_requires_authentication(self):
        response = self.client.get('/api/dashboard/')
        self.assertEqual(response.status_code, 403)

    def test_returns_moodle_and_neptun_when_authenticated(self):
        user = get_user_model().objects.create_user(username='student@bme.hu')
        self.client.force_login(user)

        response = self.client.get('/api/dashboard/')

        self.assertEqual(response.status_code, 200)
        services = {s['name']: s for s in response.json()['services']}
        self.assertTrue(services['Moodle']['sso'])
        self.assertFalse(services['Neptun']['sso'])
