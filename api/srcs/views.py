import json
from datetime import datetime
from random import randint
from io import BytesIO
from tokenize import tokenize

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
from .models import SpacedRepetitionItem 


def clean_object(instance):
    return {
        key: value for key, value in instance.items()
        if not isinstance(value, FieldFile)
    }


def order(obj):
    return obj['order']


def serializer(objects):
    return sorted(
        [clean_object(model_to_dict(obj)) for obj in objects],
        key=order
    )


def test(request):
    json_object = {'status': 'srcs READY'}
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
        "id": sheet.id,
        "description": sheet.description,
        "sections": sorted([
            {   
                "name": section.name,
                "id": section.id,
                "order": section.order,
                "items": sorted([
                    model_to_dict(item)
                    for item
                    in SectionItem.objects.filter(section=section)
                ], key=order)
            }
            for section in sections
        ], key=order)
    }
    return JsonResponse(response_data, safe=False)


def add_sr_item(request):
    section_item_id = request.GET.get('id', None)
    section_item = SectionItem.objects.filter(id=section_item_id)[0]
    sr_item = SpacedRepetitionItem.objects.create.get_or_create(
        item=section_item
    )
    return JsonResponse({'status': 'okay'})


def sr_item(request):
    action = request.GET.get('action', None)
    sr_id = request.GET.get('id', None)
    if action == 'remove':
        SpacedRepetitionItem.objects.filter(id=sr_id).delete()
    count = SpacedRepetitionItem.objects.count()
    index = randint(0, count-1)
    sr_item = SpacedRepetitionItem.objects.all()[index]
    sr_item.last_visited = datetime.now()
    sr_item.save()
    section_item = sr_item.item
    response_data = model_to_dict(section_item)
    response_data['sr_id'] = sr_item.id
    section = section_item.section
    response_data['section'] = model_to_dict(section)
    response_data['sheet'] = model_to_dict(section.cheatsheet)
    return JsonResponse(response_data, safe=False)


def flag_section(request):
    section_id = request.GET.get('id', None)
    section = SheetSection.objects.filter(id=section_id)[0]
    items = SectionItem.objects.filter(section=section)
    for item in items:
        sr_item = SpacedRepetitionItem.objects.get_or_create(item=item)
    return JsonResponse({'status': 'okay'})


def flag_cheatsheet(request):
    sheet_id = request.GET.get('id', None)
    sheet = CheatSheet.objects.filter(id=sheet_id)[0]
    sections = SheetSection.objects.filter(cheatsheet=sheet)
    for section in sections:
        items = SectionItem.objects.filter(section=section)
        for item in items:
            sr_item = SpacedRepetitionItem.objects.get_or_create(item=item)
    return JsonResponse({'status': 'okay'})


@csrf_exempt
def tokenize_python(request):
    code = json.loads(request.body)['code']
    print(code)
    as_file = BytesIO(code.encode('utf-8'))
    tokens = tokenize(as_file.readline)
    formatted = [
        { 'type': t.type, 'value': t.string }
        for t in tokens
    ]
    return JsonResponse(formatted[1: -2], safe=False)
