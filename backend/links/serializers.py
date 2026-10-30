from rest_framework import serializers

from .models import Category, Favorite, Link


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class LinkSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Link
        fields = [
            'id', 'name', 'url', 'description', 'categories',
            'is_favorited', 'created_at', 'updated_at',
        ]

    def get_is_favorited(self, obj):
        return obj.id in self.context.get('favorited_link_ids', set())


class FavoriteSerializer(serializers.ModelSerializer):
    link = LinkSerializer(read_only=True)
    link_id = serializers.PrimaryKeyRelatedField(
        queryset=Link.objects.all(), source='link', write_only=True,
    )

    class Meta:
        model = Favorite
        fields = ['link', 'link_id', 'created_at']

    def to_representation(self, instance):
        # Every row this serializer touches is, by definition, a favorite —
        # independent of whether the surrounding request's favorited_link_ids
        # snapshot was taken before or after this particular row was saved.
        data = super().to_representation(instance)
        data['link']['is_favorited'] = True
        return data
