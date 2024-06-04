from django.urls import path
from . import views

urlpatterns = [
    path('images/', views.fetch_images, name='fetch_images'),
    path('links/', views.fetch_links, name='fetch_links'),
]
