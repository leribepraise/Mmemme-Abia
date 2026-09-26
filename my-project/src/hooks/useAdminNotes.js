import { useEffect, useState } from "react";
import { addNoteToStore, getNotes } from "@/data/adminNotesStore";

// TODO: replace the internals with the notes endpoints once the backend is connected.
// Components only use what this hook returns.
const useAdminNotes = (entity, id) => {
  const [notes, setNotes] = useState(() => getNotes(entity, id));

  // Reload when the entity or id changes
  useEffect(() => {
    setNotes(getNotes(entity, id));
  }, [entity, id]);

  const addNote = ({ type, text }) => {
    const note = {
      id: String(Date.now()),
      type,
      text,
      createdAt: new Date().toISOString(),
    };
    setNotes(addNoteToStore(entity, id, note));
  };

  return { notes, addNote };
};

export default useAdminNotes;
