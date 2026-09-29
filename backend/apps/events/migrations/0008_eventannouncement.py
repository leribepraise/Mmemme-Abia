from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('events', '0007_event_images_and_deletion_review'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventAnnouncement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_user_id', models.PositiveBigIntegerField(default=0)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('event', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='announcement', to='events.event')),
            ],
        ),
    ]
