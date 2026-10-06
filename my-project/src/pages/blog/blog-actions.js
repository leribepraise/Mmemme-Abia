// Drafts may have an empty body; publishing and scheduling require content.
export function validateBlogAction(article, status, now = Date.now()) {
  if (!article.title.trim()) return { field: 'title', message: 'Add an article title before saving.' };
  if (!article.author_name.trim()) return { field: 'author_name', message: 'Add the author name.' };
  if (!/^[a-zA-Z0-9_-]+$/.test(article.slug)) return { field: 'slug', message: 'Add a URL slug using letters, numbers, hyphens or underscores.' };
  if (article.canonical_url) {
    try {
      const url = new URL(article.canonical_url);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
    } catch { return { field: 'canonical_url', message: 'Enter a complete HTTP or HTTPS canonical URL, or leave it blank.' }; }
  }
  if (status !== 'DRAFT') {
    if (!article.body.replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/g, ' ').trim()) return { field: 'body', message: 'Write article content before publishing or scheduling.' };
    if (article.featured_image && !article.featured_image_alt.trim()) return { field: 'featured_image_alt', message: 'Describe the featured image in the alt text field.' };
  }
  if (status === 'SCHEDULED' && (!article.scheduled_at || !Number.isFinite(Date.parse(article.scheduled_at)) || Date.parse(article.scheduled_at) <= now)) return { field: 'scheduled_at', message: 'Choose a future date and time to schedule this article.' };
  return null;
}

export function blogSaveMessage(status, previousStatus) {
  if (status === 'PUBLISHED') return previousStatus === 'PUBLISHED' ? 'Published changes saved.' : 'Article published. It is now visible on the blog.';
  if (status === 'SCHEDULED') return 'Article scheduled. It will publish at the selected Nigeria time.';
  return previousStatus === 'PUBLISHED' ? 'Article unpublished and saved as a draft.' : previousStatus === 'SCHEDULED' ? 'Schedule cancelled. Draft saved.' : 'Draft saved. You can continue editing or publish when ready.';
}
