# coding: utf-8
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework import viewsets, filters, permissions
from rest_framework.reverse import reverse_lazy
from .models import Package
from .serializers import PackageSerializer

# Create your views here.
User = get_user_model()

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object level permission to only show owners of an object to edit
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD, or OPTIONS request
        if request.method in permissions.SAFE_METHODS:
            return True
        # check instance owner is myself
        return obj.author == request.user

class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    filter_fields = ('name', 'author', 'stack', 'available', 'category')
    permission_classes = (IsOwnerOrReadOnly,)
    def get_queryset(self):
        # to list all *MY* packages, OR *ANY* packages that is available (in the market)
        #queryset = Package.objects.filter(author=self.request.user, available=True) # NG
        #queryset = Package.objects.filter(author=self.request.user).filter(available=True) #NG, A AND B, not A OR B
        queryset = Package.objects.filter(available=True)
        if (str(self.request.user) != "AnonymousUser"):
            mypkgs = Package.objects.filter(author=self.request.user)
            queryset = mypkgs | queryset
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