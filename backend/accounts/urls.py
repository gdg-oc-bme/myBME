from django.urls import path

from . import views

urlpatterns = [
    path('dev-login/', views.DevLoginView.as_view(), name='dev_login'),
    path('refresh/', views.RefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.MeView.as_view(), name='me'),
    path('sso/bme/', views.BmeSsoStubView.as_view(), name='sso_bme_stub'),
]
