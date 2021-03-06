from django.contrib import admin

from .models import Subject
from .models import Package
from .models import Module
from .models import Script
from .models import CheatSheet
from .models import SheetSection
from .models import SectionItem
from .models import SpacedRepetitionItem


class SpacedRepetitionItemAdmin(admin.ModelAdmin):
    readonly_fields = ('id', )
    list_display = ('__str__', 'last_visited')


class SheetSectionAdmin(admin.ModelAdmin):
    search_fields = ('name', )


class SectionItemAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'sheet', 'subject')
    search_fields = ('name', )
    autocomplete_fields = ('section', )


admin.site.register(Subject)
admin.site.register(Package)
admin.site.register(Module)
admin.site.register(Script)
admin.site.register(CheatSheet)
admin.site.register(SheetSection, SheetSectionAdmin)
admin.site.register(SectionItem, SectionItemAdmin)
admin.site.register(SpacedRepetitionItem, SpacedRepetitionItemAdmin)
