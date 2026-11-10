from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase


class MeTests(APITestCase):
    def test_requires_authentication(self):
        response = self.client.get('/accounts/me/')
        self.assertEqual(response.status_code, 403)

    def test_returns_logged_in_user(self):
        user = get_user_model().objects.create_user(
            username='student@bme.hu',
            email='student@bme.hu',
            first_name='Test',
            last_name='Student',
        )
        self.client.force_login(user)

        response = self.client.get('/accounts/me/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            'username': 'student@bme.hu',
            'email': 'student@bme.hu',
            'first_name': 'Test',
            'last_name': 'Student',
        })
