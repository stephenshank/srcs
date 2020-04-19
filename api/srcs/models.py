import json
import os
import subprocess

import ast
from django.db import models
from django.utils.text import slugify


class Subject(models.Model):
    name = models.CharField(null=True, max_length=255, blank=True)
    token = models.CharField(null=True, max_length=255, blank=True)
    icon = models.CharField(null=True, max_length=255, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class Package(models.Model):
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)
    name = models.CharField(null=True, max_length=255, blank=True)
    version = models.CharField(null=True, max_length=255, blank=True)

    def __str__(self):
        return self.name


class Module(models.Model):
    languages = (
        ('python', 'Python'),
        ('javascript', 'JavaScript')
    )
    package = models.ForeignKey('Package', on_delete=models.CASCADE, null=True)
    name = models.CharField(null=True, max_length=255)
    language = models.CharField(
        choices=languages, null=True, max_length=16, editable=False
    )

    def __str__(self):
        return self.name


class Script(models.Model):
    languages = (
        ('python', 'Python'),
        ('javascript', 'JavaScript')
    )
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)
    name = models.CharField(null=True, max_length=255, blank=True)
    token = models.CharField(null=True, max_length=255, blank=True)
    language = models.CharField(
        choices=languages, null=True, max_length=16, editable=False
    )
    script_file = models.FileField(upload_to='api/uploads/')

    def __str__(self):
        return self.name + " (" + str(self.subject) + ")"

    def save(self, *args, **kwargs):
        extension = self.script_file.name.split('.')[-1]
        if extension == 'py':
            language = 'python'
        else:
            language = 'javascript'
        self.language = language
        super().save(*args, **kwargs)
        if language == 'python':
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
                    new_module = Module.objects.create(
                        name=name, language=language
                    )
                    new_module.save()
        else:
            json_string = subprocess.check_output([
                'node', 'api/js_ast.js', self.script_file.name
            ]).decode('utf-8')
            imports = json.loads(json_string)
            for name in imports:
                exists = Module.objects.filter(name=name).count() > 0
                if not exists:
                    new_module = Module.objects.create(
                        name=name, language=language
                    )
                    new_module.save()


class CheatSheet(models.Model):
    name = models.CharField(null=True, max_length=255, blank=True)
    token = models.CharField(null=True, max_length=255, blank=True)
    description = models.TextField(null=True)
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class SheetSection(models.Model):
    name = models.CharField(null=True, max_length=255, blank=True)
    cheatsheet = models.ForeignKey('CheatSheet', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class SectionItem(models.Model):
    name = models.CharField(null=True, max_length=255, blank=True)
    shortcut = models.CharField(null=True, max_length=255, blank=True)
    section = models.ForeignKey('SheetSection', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

    def sheet(self):
        return str(self.section.cheatsheet)

    def subject(self):
        return str(self.section.cheatsheet.subject)


class SpacedRepetitionItem(models.Model):
    datetime = models.DateTimeField(auto_now_add=True)
    item = models.ForeignKey('SectionItem', on_delete=models.DO_NOTHING)
    last_visited = models.DateTimeField(null=True)
    number_of_visits = models.IntegerField(null=True)

    def __str__(self):
        return self.item.name
