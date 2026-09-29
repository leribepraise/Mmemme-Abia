from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0006_tickettype_membership_discount_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(model_name='event', name='image_card', field=models.ImageField(blank=True, null=True, upload_to='events/variants/')),
        migrations.AddField(model_name='event', name='image_detail', field=models.ImageField(blank=True, null=True, upload_to='events/variants/')),
        migrations.AddField(model_name='event', name='image_processing_last_attempt_at', field=models.DateTimeField(blank=True, null=True)),
        migrations.AddField(model_name='event', name='deletion_requested_at', field=models.DateTimeField(blank=True, null=True)),
        migrations.AddField(model_name='event', name='deletion_reviewed_at', field=models.DateTimeField(blank=True, null=True)),
        migrations.AddField(model_name='event', name='deletion_reviewed_by', field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='event_deletion_reviews', to=settings.AUTH_USER_MODEL)),
        migrations.AddField(model_name='event', name='is_archived', field=models.BooleanField(db_index=True, default=False)),
    ]
