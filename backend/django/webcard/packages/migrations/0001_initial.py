# Generated by Django 2.2.5 on 2020-05-24 20:46

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stacks', '0002_auto_20200524_2046'),
    ]

    operations = [
        migrations.CreateModel(
            name='Package',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('version', models.FloatField()),
                ('description', models.TextField(max_length=4096)),
                ('image', models.ImageField(upload_to='img/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('metadata', django.contrib.postgres.fields.jsonb.JSONField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='packages', to=settings.AUTH_USER_MODEL)),
                ('stack', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='packages', to='stacks.Stack')),
            ],
        ),
    ]
