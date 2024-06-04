from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import ImageData, LinkData

admin.site.register(ImageData)
admin.site.register(LinkData)