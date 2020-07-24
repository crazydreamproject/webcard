# coding: utf-8
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Stack

User = get_user_model()


#class AuthorSerializer(serializers.HyperlinkedModelSerializer):
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User()
        fields = ('id', 'username', 'email') # 'url', 'groups', 'email',) ... todo: dont show email for security reason


#class StackSerializer(serializers.HyperlinkedModelSerializer):
class StackSerializer(serializers.ModelSerializer):
    #author = AuthorSerializer() # humm, on POST / PUT it tries to create new user and fails... with "same user name already registered"
    class Meta:
        model = Stack
        fields = ('id', 'title', 'author', 'status', 'created_at', 'updated_at', 'data')
        #fields = ('id', 'title', 'status', 'created_at', 'updated_at', 'data') # do not show author for security reason

# serializer to call when GET list with out data
class StackListSerializer(serializers.ModelSerializer):
    #author = AuthorSerializer() # humm, on POST / PUT it tries to create new user and fails... with "same user name already registered"
    class Meta:
        model = Stack
        fields = ('id', 'title', 'author', 'status', 'created_at', 'updated_at',)
        #fields = ('id', 'title', 'status', 'created_at', 'updated_at',) # do not show author for security reason
