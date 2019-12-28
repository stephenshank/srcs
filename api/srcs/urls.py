from django.urls import path

from . import views


urlpatterns = [
    path('', views.test, name='test'),
    path('subjects', views.subjects, name='subjects'),
    path('python_ast', views.python_ast, name='python_ast'),
]

