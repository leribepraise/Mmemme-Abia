import json
from xml.etree.ElementTree import Element, SubElement, tostring

from django.conf import settings
from django.core.paginator import Paginator
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404, render, redirect
from django.utils.html import strip_tags

from .blog_content import clean_content
from .blog_models import Article, ArticleSlugRedirect, BlogImage


def image_url(image):
    return settings.FRONTEND_URL + '/blog-media/' + str(image.public_id)


def blog_image(request, public_id):
    image = get_object_or_404(BlogImage, public_id=public_id)
    response = redirect(image.image.url)
    response['Cache-Control'] = 'no-store'
    response['X-Robots-Tag'] = 'noindex'
    return response


def article_context(article, preview=False):
    canonical = article.canonical_url or settings.FRONTEND_URL + article.get_absolute_url()
    description = article.meta_description or strip_tags(article.body)[:160]
    schema = {'@context': 'https://schema.org', '@type': 'BlogPosting', 'headline': article.title, 'description': description, 'author': {'@type': 'Person', 'name': article.author_name}, 'mainEntityOfPage': canonical}
    if article.published_at:
        schema['datePublished'] = article.published_at.isoformat()
    if article.updated_at:
        schema['dateModified'] = article.updated_at.isoformat()
    if article.featured_image:
        schema['image'] = article.featured_image
    return {'article': article, 'body_html': clean_content(article.body), 'canonical': canonical, 'description': description, 'preview': preview, 'schema': json.dumps(schema).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')}


def blog_index(request):
    articles = Article.objects.public().order_by('-published_at', '-pk')
    search = request.GET.get('search', '')[:100]
    category = request.GET.get('category', '')[:80]
    tag = request.GET.get('tag', '')[:80]
    if search:
        from django.db.models import Q
        articles = articles.filter(Q(title__icontains=search) | Q(body__icontains=search))
    # Portable JSON filtering: SQLite development and PostgreSQL production.
    if category or tag:
        articles = [a for a in articles if (not category or category in a.categories) and (not tag or tag in a.tags)]
    page = Paginator(articles, 12).get_page(request.GET.get('page'))
    return render(request, 'community/blog_index.html', {'page': page, 'canonical': settings.FRONTEND_URL + '/blog', 'search': search, 'category': category, 'tag': tag, 'filtered': bool(search or category or tag or page.number > 1)})


def blog_detail(request, slug):
    # Keep existing /blog/<numeric post ID> links working after migration.
    article = Article.objects.public().filter(slug=slug).first()
    if not article:
        old = ArticleSlugRedirect.objects.filter(slug=slug, article__in=Article.objects.public()).select_related('article').first()
        if old:
            return redirect(old.article.get_absolute_url(), permanent=True)
    if not article and slug.isdigit():
        article = Article.objects.public().filter(legacy_post_id=int(slug)).first()
        if article:
            return redirect(article.get_absolute_url(), permanent=True)
    if not article:
        raise Http404('Article not found')
    response = render(request, 'community/blog_detail.html', article_context(article))
    response['Cache-Control'] = 'no-cache, max-age=0, must-revalidate'
    return response


def sitemap(request):
    root = Element('urlset', xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    # Preserve the pre-existing sitemap entries.
    paths = ['/', '/events', '/hotel', '/food', '/tourism', '/transport', '/about', '/historical-sites', '/caves-and-hills', '/religious-sites', '/adventure', '/community', '/community/groups', '/community/people', '/blog', '/contact', '/help']
    for path in paths:
        SubElement(SubElement(root, 'url'), 'loc').text = settings.FRONTEND_URL + path
    for article in Article.objects.public().only('slug', 'updated_at').iterator():
        node = SubElement(root, 'url')
        SubElement(node, 'loc').text = settings.FRONTEND_URL + article.get_absolute_url()
        SubElement(node, 'lastmod').text = article.updated_at.isoformat()
    response = HttpResponse(tostring(root, encoding='utf-8', xml_declaration=True), content_type='application/xml')
    response['Cache-Control'] = 'no-cache, max-age=0, must-revalidate'
    return response
