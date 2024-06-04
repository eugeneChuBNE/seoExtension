# analyser/views.py
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ImageData, LinkData
from .serializers import ImageDataSerializer, LinkDataSerializer

@api_view(['GET'])
def fetch_images(request):
    images = ImageData.objects.all()
    serializer = ImageDataSerializer(images, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def fetch_links(request):
    links = LinkData.objects.all()
    serializer = LinkDataSerializer(links, many=True)
    return Response(serializer.data)
