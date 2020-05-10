# coding: utf-8
from django.urls import include, path
from rest_framework import routers
from .views import StackViewSet, AuthorViewSet

router = routers.DefaultRouter()
router.register(r'stacks', StackViewSet)
router.register(r'authors', AuthorViewSet)

app_name = "stack"
urlpatterns = [
    path(r'v1/', include(router.urls), name="api-root"),
]
