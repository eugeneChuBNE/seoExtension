# Generated by Django 5.0.6 on 2024-06-04 09:44

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ImageData",
            fields=[
                ("image_id", models.AutoField(primary_key=True, serialize=False)),
                ("alt_text", models.CharField(max_length=255)),
                ("url", models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name="LinkData",
            fields=[
                ("link_id", models.AutoField(primary_key=True, serialize=False)),
                ("anchor", models.CharField(max_length=255)),
                ("url", models.URLField()),
                ("is_external", models.BooleanField(default=False)),
                ("is_nofollow", models.BooleanField(default=False)),
                ("is_new_tab", models.BooleanField(default=False)),
            ],
        ),
    ]
