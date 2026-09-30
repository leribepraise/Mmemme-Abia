import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { allPages, api } from '@/lib/api';
const identity = value => value;
const empty = [];
export function useApi(path, { list = false, map = identity } = {}) {
  const [state, setState] = useState({ data: list ? empty : null, loading: true, error: null });
  const [version, setVersion] = useState(0);
  const lastPath = useRef(null);
  useEffect(() => {
    if (!path) { lastPath.current = null; setState({ data: list ? empty : null, loading: false, error: null }); return; }
    const controller = new AbortController();
    const changedPath = lastPath.current !== path;
    lastPath.current = path;
    if (changedPath) setState({ data: list ? empty : null, loading: true, error: null });
    let inFlight = false;
    const load = async (background = false) => {
      if (inFlight || controller.signal.aborted) return;
      inFlight = true;
      try {
        const result = await (list ? allPages(path, { signal: controller.signal }) : api(path, { signal: controller.signal }));
        if (!controller.signal.aborted) {
          const next = list ? result.map(map) : map(result);
          setState(current => {
            // Preserve the object reference when the server response is unchanged;
            // forms that copy initial values must not reset during background checks.
            if (!current.loading && !current.error && JSON.stringify(current.data) === JSON.stringify(next)) return current;
            return { data: next, loading: false, error: null };
          });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          if (background) { /* Keep visible data and avoid interrupting open forms. */ }
          else { setState({ data: list ? empty : null, loading: false, error }); toast.error(error.message, { id: 'api-' + path }); }
        }
      } finally { inFlight = false; }
    };
    load();
    const update = () => { if (document.visibilityState === 'visible') load(true); };
    const storage = event => { if (event.key === 'mmemme-data-updated') update(); };
    const interval = setInterval(update, 30000);
    window.addEventListener('mmemme-data-changed', update);
    window.addEventListener('focus', update);
    window.addEventListener('online', update);
    window.addEventListener('storage', storage);
    return () => { controller.abort(); clearInterval(interval); window.removeEventListener('mmemme-data-changed', update); window.removeEventListener('focus', update); window.removeEventListener('online', update); window.removeEventListener('storage', storage); };
  }, [path, list, map, version]);
  return { ...state, reload: () => setVersion(value => value + 1) };
}
export const useCollection = (path, map = identity) => useApi(path, { list: true, map });
