from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, FavoriteViewSet, LinkViewSet

router = DefaultRouter()
router.register('links', LinkViewSet, basename='link')
router.register('categories', CategoryViewSet, basename='category')
router.register('favorites', FavoriteViewSet, basename='favorite')

urlpatterns = router.urls
