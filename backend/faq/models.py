from django.db import models


class FAQEntry(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField(help_text='Markdown supported.')
    category = models.CharField(max_length=50, blank=True)
    source_url = models.URLField(
        blank=True,
        help_text='Official BME page this answer was derived from.',
    )
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'question']
        verbose_name = 'FAQ entry'
        verbose_name_plural = 'FAQ entries'

    def __str__(self):
        return self.question
