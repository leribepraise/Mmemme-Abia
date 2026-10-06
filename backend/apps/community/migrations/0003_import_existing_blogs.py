from html import escape
from django.conf import settings
from django.db import migrations
from django.utils.text import slugify


def import_blogs(apps, schema_editor):
    Post = apps.get_model('community', 'Post')
    Article = apps.get_model('community', 'Article')
    BlogImage = apps.get_model('community', 'BlogImage')
    for post in Post.objects.filter(kind='BLOG').select_related('author').iterator():
        title = post.title or 'Untitled article'
        slug = f'{slugify(title)[:170] or "article"}-{post.pk}'
        image_url = ''
        if post.image:
            image = BlogImage.objects.create(owner_id=post.author_id, image=post.image.name, alt=title)
            image_url = settings.FRONTEND_URL + '/blog-media/' + str(image.public_id)
        article = Article.objects.create(
            author_id=post.author_id, author_name=(post.author.first_name + ' ' + post.author.last_name).strip() or post.author.username,
            title=title, slug=slug, legacy_post_id=post.pk,
            body=''.join('<p>' + escape(p).replace('\n', '<br>') + '</p>' for p in post.body.split('\n\n')),
            status='PUBLISHED' if post.status == 'PUBLISHED' else 'DRAFT',
            published_at=post.created_at if post.status == 'PUBLISHED' else None,
            categories=[post.category] if post.category else [],
            featured_image=image_url, featured_image_alt=title if image_url else '',
        )
        Article.objects.filter(pk=article.pk).update(created_at=post.created_at, updated_at=post.updated_at)


class Migration(migrations.Migration):
    dependencies = [('community', '0002_blogimage_article')]
    operations = [migrations.RunPython(import_blogs, migrations.RunPython.noop)]
