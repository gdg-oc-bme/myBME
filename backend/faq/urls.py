from rest_framework.routers import DefaultRouter

from .views import FAQEntryViewSet

router = DefaultRouter()
router.register('', FAQEntryViewSet, basename='faq')

urlpatterns = router.urls
