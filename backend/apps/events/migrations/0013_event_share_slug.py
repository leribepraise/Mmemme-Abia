from django.db import migrations, models
from django.utils.text import slugify


def populate_share_slugs(apps, schema_editor):
    Event = apps.get_model('events', 'Event')
    database = schema_editor.connection.alias
    used = set()
    for event in Event.objects.using(database).order_by('created_at', 'pk').iterator():
        base = slugify(event.title)[:255] or 'event'
        candidate, suffix = base, 1
        while candidate in used:
            suffix += 1
            candidate = f'{base}-{suffix}'
        used.add(candidate)
        Event.objects.using(database).filter(pk=event.pk).update(share_slug=candidate)


class Migration(migrations.Migration):
    dependencies = [('events', '0012_event_registration_type_event_registration_url_and_more')]
    operations = [
        migrations.AddField(model_name='event', name='share_slug',
                            field=models.SlugField(max_length=280, unique=True, null=True, editable=False)),
        migrations.RunPython(populate_share_slugs, migrations.RunPython.noop),
        migrations.AlterField(model_name='event', name='share_slug',
                              field=models.SlugField(max_length=280, unique=True, editable=False)),
    ]
