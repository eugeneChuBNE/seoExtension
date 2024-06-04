from django.shortcuts import render
from django.http import JsonResponse
from .models import ImageData, LinkData

def fetch_images(request):
    images = ImageData.objects.all()
    image_data = [{'id': img.image_id, 'alt_text': img.alt_text, 'url': img.url} for img in images]
    return JsonResponse({'images': image_data})

def fetch_links(request):
    links = LinkData.objects.all()
    link_data = [{'id': link.link_id, 'anchor': link.anchor, 'url': link.url, 
                  'is_external': link.is_external, 'is_nofollow': link.is_nofollow, 
                  'is_new_tab': link.is_new_tab} for link in links]
    return JsonResponse({'links': link_data})
