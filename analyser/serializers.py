from rest_framework import serializers
from .models import ImageData, LinkData

class ImageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageData
        fields = '__all__'

class LinkDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkData
        fields = '__all__'
