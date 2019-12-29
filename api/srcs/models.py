import os

import ast
from django.db import models
from django.utils.text import slugify


class Subject(models.Model):
    name = models.CharField(null=True, max_length=255, blank=True)
    token = models.CharField(null=True, max_length=255, blank=True)
    icon = models.CharField(null=True, max_length=255, blank=True)

    def __str__(self):
        return self.name


class Package(models.Model):
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)
    name = models.CharField(null=True, max_length=255, blank=True)
    version = models.CharField(null=True, max_length=255, blank=True)

    def __str__(self):
        return self.name


class Module(models.Model):
    package = models.ForeignKey('Package', on_delete=models.CASCADE, null=True)
    name = models.CharField(null=True, max_length=255)

    def __str__(self):
        return self.name


class Script(models.Model):
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)
    name = models.CharField(null=True, max_length=255, blank=True)
    token = models.CharField(null=True, max_length=255, blank=True)
    script_file = models.FileField(upload_to='api/uploads/')

    def __str__(self):
        return self.name + " (" + str(self.subject) + ")"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        code = self.script_file.read()
        tree = ast.parse(code)
        for node in tree.body:
            is_import_from = isinstance(node, ast.ImportFrom)
            is_import = isinstance(node, ast.Import)
            if is_import_from:
                name = node.module
            elif is_import:
                name = node.names[0].name
            else:
                continue
            exists = Module.objects.filter(name=name).count() > 0
            should_create = is_import and not exists
            if should_create:
                new_module = Module.objects.create(name=name)
                new_module.save()
