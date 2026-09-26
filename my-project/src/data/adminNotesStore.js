// Interim persistence for admin review notes. TODO: delete once the backend is connected.
// Shape in sessionStorage["adminNotes"]:
// { organizers: { "ORG-002": [ { id, type, text, createdAt } ] } }  (newest first)

const KEY = "adminNotes";

const readAll = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

const writeAll = (data) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked: fail silently, local state still works
  }
};

export const getNotes = (entity, id) => readAll()[entity]?.[String(id)] || [];

// Adds a note to the top of the list and returns the updated list
export const addNoteToStore = (entity, id, note) => {
  const all = readAll();
  const next = [note, ...(all[entity]?.[String(id)] || [])];
  all[entity] = { ...(all[entity] || {}), [String(id)]: next };
  writeAll(all);
  return next;
};
