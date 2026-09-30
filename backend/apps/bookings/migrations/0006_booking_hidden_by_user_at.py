from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('bookings', '0005_booking_completed_at')]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='hidden_by_user_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
