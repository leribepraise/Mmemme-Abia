import { createContext, useContext, useEffect, useState } from "react";
import { api, setAccess, refreshSession, clearLegacyCredentials } from "../../lib/api";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    clearLegacyCredentials();
    (async () => {
      try {
        if (await refreshSession()) {
          const current = await api("/auth/me/");
          if (!cancelled) setUser(current);
        }
      } catch { setAccess(null); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);
  const login = async credentials => {
    const result = await api("/auth/login/", { method: "POST", body: credentials });
    setAccess(result.access);
    setUser(result.user);
    return result.user;
  };
  const logout = async () => {
    try { await api("/auth/logout/", { method: "POST", body: {} }); }
    finally { setAccess(null); setUser(null); clearLegacyCredentials(); }
  };
  const reloadUser = async () => { const current = await api("/auth/me/"); setUser(current); return current; };
  return <AuthContext.Provider value={{ user, isLoggedIn: Boolean(user), loading, login, logout, reloadUser }}>{children}</AuthContext.Provider>;
};
// This context hook intentionally shares the provider's module; updates reload its consumers.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
