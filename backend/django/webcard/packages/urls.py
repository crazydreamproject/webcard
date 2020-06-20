from django.urls import path
from django.views.generic import TemplateView
from webcard.packages.views import index, publish, market

app_name = "packages"
urlpatterns = [
    path("", view=index, name="index"),
    path("publish.html", view=publish, name="publish"),
    path("market.html", view=market, name="market"),
]
