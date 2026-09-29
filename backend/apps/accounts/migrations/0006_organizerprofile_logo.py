from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('accounts', '0005_organizerprofile_coverage_region_and_more')]

    operations = [
        migrations.AddField(
            model_name='organizerprofile',
            name='logo',
            field=models.ImageField(blank=True, upload_to='organizer-logos/'),
        ),
    ]
