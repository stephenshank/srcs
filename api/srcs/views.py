import json

from django.http import JsonResponse
from django.forms.models import model_to_dict
from django.core import serializers
from django.db.models.fields.files import FieldFile
from django.views.decorators.csrf import csrf_exempt
from ast import parse
from ast2json import ast2json

from .models import Subject
from .models import Script
from .models import CheatSheet
from .models import SheetSection
from .models import SectionItem


def clean_object(instance):
    return {
        key: value for key, value in instance.items()
        if not isinstance(value, FieldFile)
    }


def serializer(objects):
    return [clean_object(model_to_dict(obj)) for obj in objects]


def test(request):
    json_object = {'status': 'okay'}
    return JsonResponse(json_object)


def subjects(request):
    subject_queryset = Subject.objects.all()
    response_data = serializer(subject_queryset)
    return JsonResponse(response_data, safe=False)


@csrf_exempt
def python_ast(request):
    code = json.loads(request.body)['code']
    ast = ast2json(parse(code))
    return JsonResponse(ast)


def scripts(request):
    token = request.GET.get('subject', '')
    subject = Subject.objects.get(token=token)
    script_queryset = Script.objects.filter(subject=subject)
    response_data = serializer(script_queryset)
    return JsonResponse(response_data, safe=False)


def script(request):
    script_id = request.GET.get('id', '')
    script = Script.objects.get(id=script_id)
    text = script.script_file.read().decode('utf-8')
    return JsonResponse({'text': text})


def sheets(request):
    token = request.GET.get('subject', '')
    subject = Subject.objects.get(token=token)
    sheet_queryset = CheatSheet.objects.filter(subject=subject)
    response_data = serializer(sheet_queryset)
    return JsonResponse(response_data, safe=False)


def sheet(request):
    token = request.GET.get('token', '')
    sheet = CheatSheet.objects.get(token=token)
    sections = SheetSection.objects.filter(cheatsheet=sheet)
    response_data = {
        "name": sheet.name,
        "description": sheet.description,
        "sections": [
            {   
                "name": section.name,
                "items": [
                    model_to_dict(item)
                    for item
                    in SectionItem.objects.filter(section=section)
                ]
            }
            for section in sections
        ]
    }
    return JsonResponse(response_data, safe=False)
