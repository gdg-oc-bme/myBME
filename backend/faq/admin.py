from django.contrib import admin

from .models import FAQEntry


@admin.register(FAQEntry)
class FAQEntryAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'is_published', 'updated_at']
    list_filter = ['category', 'is_published']
    search_fields = ['question', 'answer']
