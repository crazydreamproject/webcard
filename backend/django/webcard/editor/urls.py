from django.urls import path
from django.views.generic import TemplateView
from webcard.editor.views import index, play

app_name = "editor"
urlpatterns = [
    path("", view=index, name="index"),
    path("play/<int:stack_id>/", view=play, name="play"),
    path("audio.html", TemplateView.as_view(template_name="editor/audio.html"), name="audio"),
    path("editor.html", TemplateView.as_view(template_name="editor/editor.html"), name="editor"),
    path("script.html", TemplateView.as_view(template_name="editor/script.html"), name="script"), # need work
    path("icon.html", TemplateView.as_view(template_name="editor/icon.html"), name="icon"),
    path("msgbox.html", TemplateView.as_view(template_name="editor/msgbox.html"), name="msgbox"),
]
