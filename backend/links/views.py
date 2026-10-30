from django.contrib.postgres.search import SearchQuery
from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.response import Response

from .models import Category, Favorite, Link
from .serializers import CategorySerializer, FavoriteSerializer, LinkSerializer


class LinkViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LinkSerializer

    def get_queryset(self):
        qs = Link.objects.all().prefetch_related('categories')
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(categories__name__iexact=category)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(search_vector=SearchQuery(search, config='simple'))
        return qs.distinct()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['favorited_link_ids'] = set(
            Favorite.objects.filter(user=self.request.user).values_list('link_id', flat=True)
        )
        return context


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class FavoriteViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = FavoriteSerializer
    lookup_url_kwarg = 'link_id'

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('link')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['favorited_link_ids'] = set(self.get_queryset().values_list('link_id', flat=True))
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        link_id = kwargs['link_id']
        favorite = get_object_or_404(self.get_queryset(), link_id=link_id)
        favorite.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
