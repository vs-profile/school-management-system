from django.urls import path, include
from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "success": True,
        "message": "Welcome to School Management System API"
    })


def health_check(request):
    return JsonResponse({
        "success": True,
        "message": "School Management API is running"
    })


urlpatterns = [
    path("", home),
    path("api/health", health_check),
    path("api/", include("api.urls")),
]