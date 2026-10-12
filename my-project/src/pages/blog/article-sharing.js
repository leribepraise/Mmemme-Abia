export function articleShareLinks(title, url) {
  return [
    { name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'X', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
  ];
}

export async function copyArticleLink(url, browser = globalThis.navigator) {
  try {
    if (!browser?.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await browser.clipboard.writeText(url);
    return { copied: true };
  } catch {
    return { fallback: url };
  }
}

export async function shareArticle({ title, url }, browser = globalThis.navigator) {
  if (browser?.share) {
    try {
      await browser.share({ title, url });
      return { shared: true };
    } catch (error) {
      if (error.name === 'AbortError') return { cancelled: true };
    }
  }
  return copyArticleLink(url, browser);
}
