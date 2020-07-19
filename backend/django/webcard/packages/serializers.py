# coding: utf-8
from rest_framework import serializers
from .models import Package

#class PackageSerializer(serializers.HyperlinkedModelSerializer):
class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ('id', 'name', 'author', 'stack', 'version', 'description', 'image', 'created_at', 'updated_at', 'metadata', 'available', 'category')

''' lets use same for list
# serializer to call when GET list with out metadata
class StackListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ('id', 'title', 'author', 'status', 'created_at', 'updated_at',)
'''