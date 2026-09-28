from django.db import migrations


def seed(apps, schema_editor):
    Plan = apps.get_model('memberships', 'Plan')
    for code, name, price, features in [
        ('bronze', 'Bronze', 0, ['Event booking', 'Browse destinations', 'Save events', 'Community access']),
        ('silver', 'Silver', 2000, ['Everything in Bronze', '15% off eligible event tickets', '24-hour early booking on enabled tickets', 'Access to Silver ticket categories']),
        ('diamond', 'Diamond', 5000, ['Everything in Silver', '30% off eligible event tickets', '48-hour early booking on enabled tickets', 'Access to Diamond and VIP ticket categories']),
    ]:
        Plan.objects.get_or_create(code=code, defaults={'name': name, 'price': price, 'features': features})


class Migration(migrations.Migration):
    dependencies = [('memberships', '0001_initial')]
    operations = [migrations.RunPython(seed, migrations.RunPython.noop)]
