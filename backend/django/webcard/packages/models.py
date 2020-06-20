from django.db import models
# Create your models here.

# from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.postgres.fields import JSONField
from django.contrib.auth import get_user_model
from webcard.stacks.models import Stack

User = get_user_model()

class Package(models.Model):
    name = models.CharField(max_length=128)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="packages")
    stack = models.ForeignKey(Stack, on_delete=models.CASCADE, related_name="packages")
    version = models.FloatField()
    description = models.TextField(max_length=4096)
    image = models.ImageField(upload_to='img/') # hummmmmmm, should we limit size,height, width?
    # put below fields in product model instead...
    # publisher
    # price
    # language
    # country
    # 5-star rating
    # contents rating by age
    # category tags
    # reviews
    # grief reports
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Yes! we are using Postgres JSONField! omit encoder=DjangoJSONEncoder
    metadata = JSONField() # put everything else here for additional fields
