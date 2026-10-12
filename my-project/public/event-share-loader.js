/* Metadata comes from Django; the current frontend build handles authentication. */
(async () => {
  try {
    const response = await fetch('/share-shell.html', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Event application unavailable');
    const entry = new DOMParser().parseFromString(await response.text(), 'text/html');
    if (!entry.querySelector('meta[name="mmemme-share-shell"][content="1"]')) throw new Error('Invalid event entry');
    const scripts = [...entry.querySelectorAll('script[type="module"]')];
    if (!scripts.length) throw new Error('Missing event application');
    await Promise.all([...entry.querySelectorAll('link[rel="stylesheet"]')].map(source => new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = source.getAttribute('href');
      link.onload = resolve; link.onerror = reject;
      document.head.appendChild(link);
    })));
    for (const source of scripts) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        const ready = `mmemme-share-module-${crypto.randomUUID()}`;
        const finish = () => { clearTimeout(timeout); window.removeEventListener(ready, finish); resolve(); };
        const fail = () => { clearTimeout(timeout); window.removeEventListener(ready, finish); reject(new Error('Event module failed to load')); };
        const timeout = setTimeout(fail, 30000);
        script.type = 'module'; script.onload = finish; script.onerror = fail;
        if (source.hasAttribute('src')) script.src = source.getAttribute('src');
        else {
          // Inline modules do not consistently emit load. Signal completion after
          // Vite's development refresh imports have finished, before loading React.
          window.addEventListener(ready, finish, { once: true });
          script.textContent = `${source.textContent}\nwindow.dispatchEvent(new Event(${JSON.stringify(ready)}));`;
        }
        document.head.appendChild(script);
      });
    }
  } catch (error) {
    // Keep the public event poster and Continue link usable if assets fail.
    console.warn('Event application could not load.', error);
  }
})();
