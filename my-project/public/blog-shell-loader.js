/* Load Vite's generated entry document so hashed CSS/JS stays in sync with the
   frontend deployment, without a backend dependency on frontend build files. */
(async () => {
  try {
    const response = await fetch('/blog-shell.html', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Blog navigation assets unavailable');
    const entry = new DOMParser().parseFromString(await response.text(), 'text/html');
    if (!entry.querySelector('meta[name="mmemme-blog-shell"][content="1"]')) throw new Error('Blog navigation entry unavailable');
    const scripts = [...entry.querySelectorAll('script[type="module"]')];
    if (!scripts.length) throw new Error('Blog navigation entry missing');
    await Promise.all([...entry.querySelectorAll('link[rel="stylesheet"]')].map(source => new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = source.getAttribute('href');
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    })));
    // Sequential execution also supports Vite's development refresh preamble.
    for (const source of scripts) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.onload = resolve;
        script.onerror = reject;
        if (source.hasAttribute('src')) script.src = source.getAttribute('src');
        else script.textContent = source.textContent;
        document.head.appendChild(script);
      });
    }
  } catch (error) {
    // The server-rendered article and usable fallback navigation remain visible.
    console.warn('Blog navigation could not load.', error);
  }
})();
