# Generated by Django 2.2 on 2020-01-24 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('srcs', '0002_spacedrepetitionitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='spacedrepetitionitem',
            name='last_visited',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='spacedrepetitionitem',
            name='number_of_visits',
            field=models.IntegerField(null=True),
        ),
    ]