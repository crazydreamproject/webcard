from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.reverse import reverse_lazy
from django.conf import settings

# Create your views here.
User = get_user_model()

def index(request):
    context = {
        'User': request.user,
        'ApiUrl': reverse_lazy('stack:api-root', request=request),
        'settings': settings,
    }
    return render(request, 'editor/index.html', context)

def play(request, stack_id):
    context = {
        'User': request.user,
        'ApiUrl': reverse_lazy('stack:api-root', request=request),
        'StackId': stack_id,
        'settings': settings,
    }
    return render(request, 'editor/index.html', context)
