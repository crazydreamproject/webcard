from django.db import models
# from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.postgres.fields import JSONField
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class Stack(models.Model):
    # list of states
    STATUS_DEVELOP = "develop"
    STATUS_TESTING = "testing"
    STATUS_PUBLISH = "publish"
    STATUS_SET = (
        (STATUS_DEVELOP, "Under Development"),
        (STATUS_TESTING, "Under Testing"),
        (STATUS_PUBLISH, "Published"),
    )
    # name of this stack
    title = models.CharField(max_length=128)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="stacks")
    status = models.CharField(choices=STATUS_SET, default=STATUS_DEVELOP, max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Yes! we are using Postgres JSONField! omit encoder=DjangoJSONEncoder
    data = JSONField()