from django.contrib import admin

from .models import Category, Link


@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ['name', 'url', 'updated_at']
    search_fields = ['name', 'description', 'search_terms']
    # Categories are assigned via the API or shell: Link.categories has an
    # explicit `through` model with a composite primary key, which Django
    # admin can't yet register (inline or otherwise).


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
