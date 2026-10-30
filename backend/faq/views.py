from rest_framework import filters, viewsets

from .models import FAQEntry
from .serializers import FAQEntrySerializer


class FAQEntryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = FAQEntrySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['question', 'answer']

    def get_queryset(self):
        qs = FAQEntry.objects.filter(is_published=True)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs
