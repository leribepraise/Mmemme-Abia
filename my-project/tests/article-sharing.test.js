import assert from 'node:assert/strict';
import test from 'node:test';
import { articleShareLinks, copyArticleLink, shareArticle } from '../src/pages/blog/article-sharing.js';

const article = { title: 'Culture & food: what’s on?', url: 'https://www.mmemme.com.ng/blog/abia-culture' };

test('network share links preserve the exact article title and URL', () => {
  const links = articleShareLinks(article.title, article.url).map(link => new URL(link.url));
  assert.equal(links[0].searchParams.get('text'), `${article.title} ${article.url}`);
  assert.equal(links[1].searchParams.get('u'), article.url);
  assert.equal(links[2].searchParams.get('text'), article.title);
  assert.equal(links[2].searchParams.get('url'), article.url);
});
test('native sharing uses the article, while cancelling never copies unexpectedly', async () => {
  let payload;
  assert.deepEqual(await shareArticle(article, { share: async value => { payload = value; } }), { shared: true });
  assert.deepEqual(payload, article);
  const browser = { share: async () => { throw Object.assign(new Error(), { name: 'AbortError' }); }, clipboard: { writeText: () => assert.fail('Cancelling must not copy') } };
  assert.deepEqual(await shareArticle(article, browser), { cancelled: true });
});
test('unsupported or failed native sharing falls back to copying the link', async () => {
  let copied;
  const browser = { clipboard: { writeText: async value => { copied = value; } } };
  assert.deepEqual(await shareArticle(article, browser), { copied: true });
  assert.equal(copied, article.url);
  browser.share = async () => { throw new Error('Unavailable'); };
  assert.deepEqual(await shareArticle(article, browser), { copied: true });
});
test('blocked or unavailable clipboard exposes a manual-copy link', async () => {
  assert.deepEqual(await copyArticleLink(article.url, {}), { fallback: article.url });
  const browser = { clipboard: { writeText: async () => { throw new Error('Permission denied'); } } };
  assert.deepEqual(await copyArticleLink(article.url, browser), { fallback: article.url });
});
