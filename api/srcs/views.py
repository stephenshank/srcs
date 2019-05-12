import json

from django.http import JsonResponse
from django.core import serializers

from .models import Subject


def test(request):
    json_object = {'status': 'okay'}
    return JsonResponse(json_object)


def subjects(request):
    subject_queryset = Subject.objects.all()
    serialized_query = serializers.serialize('json', subject_queryset)
    response_json = json.loads(serialized_query)
    human_readable = [record["fields"] for record in response_json]
    return JsonResponse(human_readable, safe=False)

