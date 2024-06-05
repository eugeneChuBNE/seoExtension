from django.db import models

class ImageData(models.Model):
    id = models.AutoField(primary_key=True)
    alt_text = models.CharField(max_length=255)
    url = models.URLField()
    name = models.CharField(max_length=255, null=True, blank=True)
    format = models.CharField(max_length=10, null=True, blank=True)
    caption = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.alt_text

class LinkData(models.Model):
    link_id = models.AutoField(primary_key=True)
    anchor = models.CharField(max_length=255)
    url = models.URLField()
    is_external = models.BooleanField(default=False)
    is_nofollow = models.BooleanField(default=False)
    is_new_tab = models.BooleanField(default=False)

    def __str__(self):
        return self.url