import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

test('blog shell completes the inline development preamble before loading the entry', async () => {
  const loader = await readFile(new URL('../public/blog-shell-loader.js', import.meta.url), 'utf8');
  const appended = [];
  const sources = [
    { hasAttribute: () => false, textContent: 'window.preambleReady = true;' },
    { hasAttribute: () => true, getAttribute: () => '/src/blog-shell.jsx' },
  ];
  const entry = {
    querySelector: () => ({}),
    querySelectorAll: selector => selector.startsWith('script') ? sources : [],
  };
  const context = vm.createContext({
    window: {}, Event, crypto: { randomUUID: () => 'test-module' }, console,
    fetch: async () => ({ ok: true, text: async () => '' }),
    DOMParser: class { parseFromString() { return entry; } },
    document: {
      createElement: () => ({ dispatchEvent() { this.onload(); } }),
      getElementById: id => appended.find(script => script.id === id),
      head: { appendChild(script) {
        appended.push(script);
        if (script.src) {
          assert.equal(context.window.preambleReady, true);
          script.onload();
        } else vm.runInContext(script.textContent, context);
      } },
    },
  });
  await vm.runInContext(loader, context);
  assert.equal(appended.length, 2);
  assert.equal(appended[1].src, '/src/blog-shell.jsx');
});
