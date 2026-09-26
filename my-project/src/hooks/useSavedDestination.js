import { useEffect, useState } from "react";

const KEY = "savedDestinations";
const EVENT = "savedDestinationsUpdated";

const readAll = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

const writeAll = (ids) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // storage full or blocked: fail silently
  }
  window.dispatchEvent(new Event(EVENT));
};

const useSavedDestination = (id) => {
  const [saved, setSaved] = useState(() => readAll().includes(id));

  useEffect(() => {
    const sync = () => setSaved(readAll().includes(id));
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [id]);

  const toggleSaved = () => {
    const all = readAll();
    const next = all.includes(id) ? all.filter((x) => x !== id) : [...all, id];
    writeAll(next);
  };

  return { saved, toggleSaved };
};

export default useSavedDestination;
