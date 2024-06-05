from rest_framework import serializers
from .models import ImageData, LinkData

class ImageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageData
        fields = ['id', 'alt_text', 'url', 'name', 'format', 'caption']

class LinkDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkData
        fields = ['link_id', 'anchor', 'url', 'is_external', 'is_nofollow', 'is_new_tab']
