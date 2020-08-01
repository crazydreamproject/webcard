# coding: utf-8
#from django.shortcuts import render
#import django_filters
from django.contrib.auth import get_user_model
from rest_framework import viewsets, filters, permissions
from .models import Stack
from .serializers import StackSerializer, StackListSerializer, AuthorSerializer

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

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AuthorSerializer
    filter_fields = ('username',)
    permission_classes = (IsOwnerOrReadOnly,)
    def get_queryset(self):
        # just show me, or otherwise anyone can see other's email!
        queryset = User.objects.filter(username=self.request.user)
        return queryset
    

class StackViewSet(viewsets.ModelViewSet):
    queryset = Stack.objects.all()
    permission_classes = (IsOwnerOrReadOnly,)
    #serializer_class = StackSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return StackListSerializer
        else:
            return StackSerializer
    filter_fields = ('title', 'author', 'status',)
    def get_queryset(self):
        queryset = Stack.objects.filter(status="publish")
        if (str(self.request.user) != "AnonymousUser"):
            # just show my stacks list or any published stacks
            mystacks = Stack.objects.filter(author=self.request.user)
            queryset = mystacks | queryset
        return queryset