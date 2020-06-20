from django.contrib import admin
# Register your models here.
from .models import Package

@admin.register(Package)
class Package(admin.ModelAdmin):
    pass
