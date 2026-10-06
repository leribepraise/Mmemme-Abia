# Blog studio

Editors sign in at `/blog-editor/login`. This uses the existing account login and grants no staff access. Editors with the `community.manage_blog` permission can manage all articles in the shared blog, including articles created by other editors. Ordinary users cannot grant themselves this permission.

## Deploy

1. Deploy backend and frontend from the same revision. The backend requirements include `nh3` for HTML sanitization. Run `python manage.py migrate` before starting the updated API and worker.
2. Keep `FRONTEND_URL` set to your public website origin (for example `https://mmemme.com.ng`), with no trailing slash. Canonicals and sitemap URLs use this setting rather than the backend hostname.
3. Keep the existing `python manage.py process_jobs` worker running. Each tick publishes due scheduled articles, retaining the planned time as their publication date. If the worker stops, scheduled posts stay private until it resumes.
4. The Caddy and Vercel configurations now proxy `/blog`, `/blog/*`, `/blog-media/*`, and `/sitemap.xml` to Django, before the SPA fallback. The Vite development server also proxies these routes. For other hosting platforms configure the same rules. `vite preview` alone cannot serve backend-rendered pages.
5. Register and verify a separate non-staff account, then run from the backend service:

   ```sh
   python manage.py grant_blog_editor writer@example.com
   ```

   To revoke access:

   ```sh
   python manage.py grant_blog_editor writer@example.com --revoke
   ```

6. Uploads use the existing Django media storage. Production requires its configured durable upload bucket or persistent media volume. The frontend proxy already forwards local `/media/*` routes.
   Blog uploads use stable `/blog-media/<random-uuid>` URLs. Each request redirects to a fresh storage URL so expiring S3 links are never persisted in article HTML. Image URLs are accessible to anyone who has their link; article draft pages remain private.

## Behavior

- Rich text supports headings, bold, italic, links, lists, quotes, inline images, and editable tables. Content is sanitized before storage and again before HTML rendering.
- Articles start as drafts. Preview uses the public article template with `noindex`, `no-store`, and a sandboxed iframe; preview never writes the article.
- Scheduling inputs explicitly use Africa/Lagos (UTC+01:00), independent of the editor's device timezone. Times are stored as timezone-aware timestamps.
- Every published article has a `/blog/<slug>` page with complete HTML, title, description, canonical, author, publication date, Open Graph metadata, and BlogPosting structured data. Empty canonical fields resolve to the article URL.
- The live sitemap preserves existing entries and queries only published articles. Drafts, scheduled posts, inactive authors, unpublished articles, and deleted articles are excluded. Article and sitemap responses require cache revalidation.
- Existing backend blog posts are copied into the new article model during migration. Numeric `/blog/<post-id>` links redirect to their new slug URLs. Legacy community APIs no longer expose or modify blog content.
- Changing a slug creates a permanent redirect from the old URL to the new URL. Old URLs remain reserved for that article, and redirects become unavailable when the article is unpublished or deleted.
- Deleting an article permanently removes its record. Uploaded media remains in storage to avoid breaking images reused in other articles.

## Verify

```sh
python manage.py test tests.test_blog_editor tests.test_admin_dashboard --settings=config.settings.test
python manage.py makemigrations --check --dry-run --settings=config.settings.test
```

From `my-project`, run `npm run build`, `npm run check:runtime`, and `npm test`.

After deployment, verify the public article's **view source** contains its body and metadata, check `/sitemap.xml`, and use Google Search Console URL inspection on a published article. This implementation enables discovery and indexing; ranking depends on Google and the quality of the content.
