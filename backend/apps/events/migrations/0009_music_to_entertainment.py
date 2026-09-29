from django.db import migrations


def rename_music_events(apps, schema_editor):
    Event = apps.get_model('events', 'Event')
    Event.objects.using(schema_editor.connection.alias).filter(category__iexact='Music').update(category='Entertainment')


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0008_eventannouncement'),
    ]

    operations = [
        migrations.RunPython(rename_music_events, migrations.RunPython.noop),
    ]
