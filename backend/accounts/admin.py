from django.contrib import admin

from .models import EduUser


@admin.register(EduUser)
class EduUserAdmin(admin.ModelAdmin):
    list_display = ['eduid_subject', 'display_name', 'email', 'role', 'last_login_at']
    list_filter = ['role']
    search_fields = ['eduid_subject', 'display_name', 'email']
    readonly_fields = ['id', 'eduid_subject', 'created_at', 'last_login_at']
