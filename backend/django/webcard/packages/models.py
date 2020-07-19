from django.db import models
# Create your models here.

# from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.postgres.fields import JSONField
from django.contrib.auth import get_user_model
from webcard.stacks.models import Stack

User = get_user_model()

class Package(models.Model):
    # lists of categories
    CATEG_PLAYABLE = "playable"
    CATEG_TUTORIAL = "tutorial"
    CATEG_PLUGIN = "plugin"
    CATEG_SET = (
        (CATEG_PLAYABLE, "Playable"),
        (CATEG_TUTORIAL, "Tutorial"),
        (CATEG_PLUGIN, "Plugin"),
    )
    name = models.CharField(max_length=128)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="packages")
    stack = models.ForeignKey(Stack, on_delete=models.CASCADE, related_name="packages")
    version = models.FloatField()
    description = models.TextField(max_length=4096)
    image = models.ImageField(upload_to='img/') # hummmmmmm, should we limit size,height, width?
    category = models.CharField(choices=CATEG_SET, default=CATEG_PLAYABLE, max_length=16)
    available = models.BooleanField(default=False) # in the market or not
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
