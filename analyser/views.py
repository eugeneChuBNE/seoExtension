from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ImageData, LinkData
from .serializers import ImageDataSerializer, LinkDataSerializer

@api_view(['GET', 'POST'])
def fetch_images(request):
    if request.method == 'POST':
        serializer = ImageDataSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    images = ImageData.objects.all()
    serializer = ImageDataSerializer(images, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def fetch_links(request):
    if request.method == 'POST':
        serializer = LinkDataSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    links = LinkData.objects.all()
    serializer = LinkDataSerializer(links, many=True)
    return Response(serializer.data)
