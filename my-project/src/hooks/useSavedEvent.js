import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "savedEvents";
const UPDATE_EVENT = "savedEventsUpdated";

const readSavedEvents = () => {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  try {
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useSavedEvent = (event) => {
  const [isSaved, setIsSaved] = useState(() =>
    event ? readSavedEvents().some((e) => e.id === event.id) : false,
  );

  useEffect(() => {
    const syncFromStorage = () => {
      if (!event) return;
      setIsSaved(readSavedEvents().some((e) => e.id === event.id));
    };

    window.addEventListener(UPDATE_EVENT, syncFromStorage);
    return () => window.removeEventListener(UPDATE_EVENT, syncFromStorage);
  }, [event]);

  const toggleSaved = useCallback(() => {
    if (!event) return;

    const events = readSavedEvents();
    const alreadySaved = events.some((e) => e.id === event.id);

    let updatedEvents;

    if (alreadySaved) {
      updatedEvents = events.filter((e) => e.id !== event.id);
    } else {
      const eventToSave = {
        id: event.id,
        title: event.text,
        image: event.image,
        location: event.text2,
        price: event.text3,
      };
      updatedEvents = [eventToSave, ...events];
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
    window.dispatchEvent(new Event(UPDATE_EVENT));
    setIsSaved(!alreadySaved);
  }, [event]);

  return { isSaved, toggleSaved };
};
