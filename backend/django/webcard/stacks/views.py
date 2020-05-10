# coding: utf-8
#from django.shortcuts import render
#import django_filters
from django.contrib.auth import get_user_model
from rest_framework import viewsets, filters
from .models import Stack
from .serializers import StackSerializer, StackListSerializer, AuthorSerializer

# Create your views here.
User = get_user_model()

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AuthorSerializer
    filter_fields = ('username',)
    def get_queryset(self):
        # just show me, or otherwise anyone can see other's email!
        queryset = User.objects.filter(username=self.request.user)
        return queryset
    

class StackViewSet(viewsets.ModelViewSet):
    queryset = Stack.objects.all()
    #serializer_class = StackSerializer
    def get_serializer_class(self):
        if self.action == 'list':
            return StackListSerializer
        else:
            return StackSerializer
    filter_fields = ('title', 'author', 'status',)
    def get_queryset(self):
        # just show my stack list or anyone can see other's stacks!
        queryset = Stack.objects.filter(author=self.request.user)
        return queryset