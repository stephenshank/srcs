from django.urls import path

from . import views


urlpatterns = [
    path('', views.test, name='test'),
    path('subjects', views.subjects, name='subjects'),
    path('python_ast', views.python_ast, name='python_ast'),
    path('scripts', views.scripts, name='scripts'),
    path('script', views.script, name='script'),
    path('sheets', views.sheets, name='sheets'),
    path('sheet', views.sheet, name='sheet'),
    path('sr_item', views.sr_item, name='sr_item'),
    path('add_sr_item', views.add_sr_item, name='add_sr_item'),
]
