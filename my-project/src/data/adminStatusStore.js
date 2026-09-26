// Interim persistence for admin status changes (Suspend / Reactivate) so the list
// and detail pages agree. TODO: delete this file once the backend is connected.
// Shape in sessionStorage["adminStatusOverrides"]:
// { users: { "3": { status, before } }, organizers: { "ORG-002": { status, before } } }
// `before` is the pre-suspension status, so Reactivate can restore it.

const KEY = "adminStatusOverrides";

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

export const getStatusOverrides = (entity) => readAll()[entity] || {};

export const getStatusOverride = (entity, id) =>
  getStatusOverrides(entity)[String(id)] || null;

export const setStatusOverride = (entity, id, override) => {
  const all = readAll();
  all[entity] = { ...(all[entity] || {}), [String(id)]: override };
  writeAll(all);
};

// Lays saved status changes over a list of rows (used by the list hooks).
export const applyStatusOverrides = (entity, rows) => {
  const overrides = getStatusOverrides(entity);
  return rows.map((row) => {
    const o = overrides[String(row.id)];
    return o
      ? { ...row, status: o.status, statusBeforeSuspend: o.before }
      : row;
  });
};
