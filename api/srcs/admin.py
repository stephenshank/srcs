from django.contrib import admin

from .models import Subject
from .models import Package
from .models import Module
from .models import Script
from .models import CheatSheet
from .models import SheetSection
from .models import SectionItem
from .models import SpacedRepetitionItem

admin.site.register(Subject)
admin.site.register(Package)
admin.site.register(Module)
admin.site.register(Script)
admin.site.register(CheatSheet)
admin.site.register(SheetSection)
admin.site.register(SectionItem)
admin.site.register(SpacedRepetitionItem)
