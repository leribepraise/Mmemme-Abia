from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0011_majoreventannouncement'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='registration_type',
            field=models.CharField(choices=[('TICKETED', 'Tickets on Mmemme Abia'), ('EXTERNAL', 'External registration')], default='TICKETED', max_length=10),
        ),
        migrations.AddField(
            model_name='event',
            name='registration_url',
            field=models.URLField(blank=True, max_length=1000),
        ),
        migrations.AddConstraint(
            model_name='event',
            constraint=models.CheckConstraint(
                condition=(models.Q(registration_type='TICKETED', registration_url='') |
                           (models.Q(registration_type='EXTERNAL') & ~models.Q(registration_url=''))),
                name='event_registration_valid',
            ),
        ),
    ]
