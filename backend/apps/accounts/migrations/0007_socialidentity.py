from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0006_organizerprofile_logo'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialIdentity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider', models.CharField(choices=[('google', 'Google'), ('apple', 'Apple')], max_length=20)),
                ('subject', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_identities', to=settings.AUTH_USER_MODEL)),
            ],
            options={'constraints': [models.UniqueConstraint(fields=('provider', 'subject'), name='social_identity_provider_subject')]},
        ),
    ]
