import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { allPages, api } from '@/lib/api';
const identity = value => value;
const empty = [];
export function useApi(path, { list = false, map = identity } = {}) {
  const [state, setState] = useState({ data: list ? empty : null, loading: true, error: null });
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!path) { setState({ data: list ? empty : null, loading: false, error: null }); return; }
    const controller = new AbortController();
    setState({ data: list ? empty : null, loading: true, error: null });
    (list ? allPages(path, { signal: controller.signal }) : api(path, { signal: controller.signal }))
      .then(result => { if (!controller.signal.aborted) setState({ data: list ? result.map(map) : map(result), loading: false, error: null }); })
      .catch(error => { if (!controller.signal.aborted) { setState({ data: list ? empty : null, loading: false, error }); toast.error(error.message, { id: 'api-' + path }); } });
    return () => controller.abort();
  }, [path, list, map, version]);
  return { ...state, reload: () => setVersion(value => value + 1) };
}
export const useCollection = (path, map = identity) => useApi(path, { list: true, map });
