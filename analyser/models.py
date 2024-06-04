from django.db import models

class ImageData(models.Model):
    image_id = models.AutoField(primary_key=True)
    alt_text = models.CharField(max_length=255)
    url = models.URLField()

class LinkData(models.Model):
    link_id = models.AutoField(primary_key=True)
    anchor = models.CharField(max_length=255)
    url = models.URLField()
    is_external = models.BooleanField(default=False)
    is_nofollow = models.BooleanField(default=False)
    is_new_tab = models.BooleanField(default=False)
