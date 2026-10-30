from rest_framework import serializers

from .models import FAQEntry


class FAQEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQEntry
        fields = ['id', 'question', 'answer', 'category', 'source_url', 'updated_at']
