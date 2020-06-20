# coding: utf-8
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import viewsets, filters
from rest_framework.reverse import reverse_lazy
from .models import Package
from .serializers import PackageSerializer

# Create your views here.
User = get_user_model()

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    filter_fields = ('name', 'author', 'stack', )
    def get_queryset(self):
        # just show my stack list or anyone can see other's stacks!
        queryset = Package.objects.filter(author=self.request.user)
        return queryset

def index(request):
    context = {
        'User': request.user,
        'ApiUrl': reverse_lazy('stack:api-root', request=request),
        'settings': settings,
    }
    return render(request, 'packages/index.html', context)

def publish(request):
    context = {
        'User': request.user,
        'ApiUrl': reverse_lazy('stack:api-root', request=request),
        'settings': settings,
    }
    return render(request, 'packages/publish.html', context)

def market(request):
    context = {
        'User': request.user,
        'ApiUrl': reverse_lazy('stack:api-root', request=request),
        'settings': settings,
    }
    return render(request, 'packages/market.html', context)