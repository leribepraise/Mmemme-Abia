from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('notifications', '0003_pushsubscription_pushdelivery')]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='deleted_at',
            field=models.DateTimeField(blank=True, db_index=True, null=True),
        ),
    ]
