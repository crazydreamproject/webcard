# coding: utf-8
from django.urls import include, path
from rest_framework import routers
from .views import StackViewSet, AuthorViewSet
from webcard.packages.views import PackageViewSet

router = routers.DefaultRouter()
router.register(r'stacks', StackViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'packages', PackageViewSet)

app_name = "stack" # humm... now packages are included, need concern.
urlpatterns = [
    path(r'v1/', include(router.urls), name="api-root"),
]
