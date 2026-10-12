import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def import_legacy_comments(apps, schema_editor):
    Article = apps.get_model('community', 'Article')
    Comment = apps.get_model('community', 'Comment')
    ArticleComment = apps.get_model('community', 'ArticleComment')
    articles = dict(Article.objects.exclude(legacy_post_id=None).values_list('legacy_post_id', 'pk'))
    for old in Comment.objects.filter(post_id__in=articles).iterator():
        comment = ArticleComment.objects.create(
            article_id=articles[old.post_id], author_id=old.author_id,
            body=old.body, is_hidden=old.is_hidden,
        )
        ArticleComment.objects.filter(pk=comment.pk).update(created_at=old.created_at)


class Migration(migrations.Migration):
    dependencies = [
        ('community', '0004_articleslugredirect'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]
    operations = [
        migrations.CreateModel(
            name='ArticleComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.CharField(max_length=2000)),
                ('is_hidden', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='community.article')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-created_at', '-pk']},
        ),
        migrations.RunPython(import_legacy_comments, migrations.RunPython.noop),
    ]
