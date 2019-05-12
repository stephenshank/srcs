from django.db import models
from django.utils.text import slugify


class Subject(models.Model):
    name = models.CharField(null=True, max_length=255, blank=True)
    token = models.CharField(null=True, max_length=255, blank=True)
    def __str__(self):
        return self.name
