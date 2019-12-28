from django.contrib import admin

from .models import Subject
from .models import Package
from .models import Module
from .models import Script

admin.site.register(Subject)
admin.site.register(Package)
admin.site.register(Module)
admin.site.register(Script)

