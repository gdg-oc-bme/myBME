import uuid

from django.contrib.postgres.search import SearchVector, SearchVectorField
from django.db import models

from accounts.models import EduUser


class Link(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField(null=True, blank=True)
    search_terms = models.TextField(
        null=True, blank=True,
        help_text='Extra keywords, including Hungarian synonyms.',
    )
    # The actual GENERATED ALWAYS AS (...) STORED column + GIN index are created
    # by the Alembic migration. GeneratedField just tells the Django ORM this
    # column is DB-computed, so it's never included in INSERT/UPDATE.
    search_vector = models.GeneratedField(
        expression=SearchVector('name', 'description', 'search_terms', config='simple'),
        output_field=SearchVectorField(),
        db_persist=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    categories = models.ManyToManyField('Category', through='LinkCategory', related_name='links')

    class Meta:
        managed = False
        db_table = 'links'

    def __str__(self):
        return self.name


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        managed = False
        db_table = 'categories'

    def __str__(self):
        return self.name


class LinkCategory(models.Model):
    pk = models.CompositePrimaryKey('link_id', 'category_id')
    link = models.ForeignKey(Link, on_delete=models.CASCADE, db_column='link_id')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, db_column='category_id')

    class Meta:
        managed = False
        db_table = 'link_categories'


class Favorite(models.Model):
    pk = models.CompositePrimaryKey('user_id', 'link_id')
    user = models.ForeignKey(EduUser, on_delete=models.CASCADE, db_column='user_id')
    link = models.ForeignKey(Link, on_delete=models.CASCADE, db_column='link_id')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'favorites'
