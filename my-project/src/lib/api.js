const base = (import.meta.env?.VITE_API_BASE_URL || "/api/v1").replace(/\/$/, "");
let access = null;
let csrf = null;
let refreshPending = null;
const flatten = value => typeof value === "string" ? value : Array.isArray(value) ? value.map(flatten).join(" ") : value && typeof value === "object" ? Object.values(value).map(flatten).join(" ") : "";
const unavailable = () => new Error("This service is temporarily unavailable. Please try again shortly.");
async function readJSON(response) {
  const type = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const isJSON = type === "application/json" || (type.startsWith("application/") && type.endsWith("+json"));
  if (!isJSON) throw unavailable();
  try { return await response.json(); }
  catch { throw unavailable(); }
}
export async function csrfToken() {
  if (!csrf) {
    const response = await fetch(base + "/auth/csrf/", { credentials: "include" });
    if (!response.ok) throw new Error("Unable to connect. Please try again.");
    const data = await readJSON(response);
    if (typeof data?.csrf_token !== "string" || !data.csrf_token) throw unavailable();
    csrf = data.csrf_token;
  }
  return csrf;
}
export function setAccess(token) { access = token; }
export async function refreshSession() {
  if (!refreshPending) {
    refreshPending = (async () => {
      const token = await csrfToken();
      const response = await fetch(base + "/auth/refresh/", { method: "POST", credentials: "include", headers: { "X-CSRFToken": token, "Content-Type": "application/json" }, body: "{}" });
      if (!response.ok) { access = null; return false; }
      const data = await readJSON(response);
      if (typeof data?.access !== "string" || !data.access) throw unavailable();
      access = data.access;
      return true;
    })().finally(() => { refreshPending = null; });
  }
  return refreshPending;
}
export async function api(path, { method = "GET", body, key, retry = true, blob = false } = {}) {
  const headers = {};
  if (access) headers.Authorization = "Bearer " + access;
  if (key) headers["Idempotency-Key"] = key;
  if (!["GET", "HEAD"].includes(method)) headers["X-CSRFToken"] = await csrfToken();
  if (body !== undefined && !(body instanceof FormData)) headers["Content-Type"] = "application/json";
  const response = await fetch(base + path, { method, credentials: "include", headers, body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body) });
  const publicAuth=["/auth/login/","/auth/register/","/auth/refresh/","/auth/logout/"];
  if (response.status === 401 && retry && !publicAuth.includes(path) && await refreshSession()) return api(path, { method, body, key, retry: false, blob });
  if (response.status === 204) return null;
  if (blob && response.ok) return response.blob();
  const data = await readJSON(response);
  if (!response.ok) {
    const error = new Error(flatten(data?.error || data?.detail) || (response.status === 401 ? "Please log in to continue." : "The request could not be completed."));
    error.status = response.status;
    throw error;
  }
  return data;
}
export async function apiPage(path) {
  const data = await api(path);
  if (!data || !Array.isArray(data.results)) throw unavailable();
  return data;
}
export function clearLegacyCredentials() {
  for (const storage of [sessionStorage, localStorage]) {
    for (const key of ["user", "signupData", "isLoggedIn", "mmemme-auth"]) storage.removeItem(key);
  }
}
export const money = value => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(value || 0));
