from django.contrib import admin
from .models import Stack
# Register your models here.

@admin.register(Stack)
class Stack(admin.ModelAdmin):
    pass
