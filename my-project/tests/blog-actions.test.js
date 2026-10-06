import assert from 'node:assert/strict';
import test from 'node:test';
import { blogSaveMessage, validateBlogAction } from '../src/pages/blog/blog-actions.js';

const article = { title: 'Abia stories', author_name: 'Ada', slug: 'abia-stories', body: '', canonical_url: '', featured_image: '', featured_image_alt: '', scheduled_at: null };

test('an incomplete draft can save, but cannot publish until it has content', () => {
  assert.equal(validateBlogAction(article, 'DRAFT'), null);
  assert.equal(validateBlogAction(article, 'PUBLISHED').field, 'body');
  assert.equal(validateBlogAction({ ...article, body: '<p>&nbsp;</p>' }, 'PUBLISHED').field, 'body');
  assert.equal(validateBlogAction({ ...article, body: '<p>A story</p>' }, 'PUBLISHED'), null);
});
test('invalid identity and SEO fields direct the editor to the field needing attention', () => {
  for (const [field, value] of [['title', ' '], ['author_name', ''], ['slug', 'has spaces'], ['canonical_url', 'javascript:alert(1)']]) {
    assert.equal(validateBlogAction({ ...article, [field]: value }, 'DRAFT').field, field);
  }
});
test('publishing a cover requires its alt text, while drafts can keep unfinished alt text', () => {
  const cover = { ...article, body: '<p>Story</p>', featured_image: '/blog-media/cover' };
  assert.equal(validateBlogAction(cover, 'DRAFT'), null);
  assert.equal(validateBlogAction(cover, 'PUBLISHED').field, 'featured_image_alt');
});
test('scheduling checks future time without blocking save draft', () => {
  const now = Date.parse('2026-10-06T12:00:00+01:00');
  const story = { ...article, body: '<p>Story</p>' };
  for (const scheduled_at of [null, 'invalid', '2026-10-06T11:00:00+01:00']) {
    assert.equal(validateBlogAction({ ...story, scheduled_at }, 'SCHEDULED', now).field, 'scheduled_at');
    assert.equal(validateBlogAction({ ...story, scheduled_at }, 'DRAFT', now), null);
  }
  assert.equal(validateBlogAction({ ...story, scheduled_at: '2026-10-06T13:00:00+01:00' }, 'SCHEDULED', now), null);
});
test('save feedback distinguishes a live update, unpublishing and cancelling a schedule', () => {
  assert.match(blogSaveMessage('PUBLISHED', 'DRAFT'), /now visible/);
  assert.match(blogSaveMessage('PUBLISHED', 'PUBLISHED'), /changes saved/);
  assert.match(blogSaveMessage('DRAFT', 'PUBLISHED'), /unpublished/);
  assert.match(blogSaveMessage('DRAFT', 'SCHEDULED'), /Schedule cancelled/);
});
