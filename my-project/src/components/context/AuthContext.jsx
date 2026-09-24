import { useContext, useEffect, useState } from 'react';
import { api, clearLegacyCredentials, refreshSession, setAccess } from '@/lib/api';
import { AuthContext } from './AuthState';

const displayUser = user => user && ({ ...user, fullName: [user.first_name, user.last_name].filter(Boolean).join(' '), dateOfBirth: user.date_of_birth || '', profilePicture: user.avatar || '', plan: 'bronze' });
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    clearLegacyCredentials();
    refreshSession().then(ok => ok ? api('/auth/me/') : null).then(data => { if (active) setUser(displayUser(data)); }).catch(() => { if (active) setUser(null); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const login = async credentials => {
    const result = await api('/auth/login/', { method: 'POST', body: credentials });
    setAccess(result.access);
    setUser(displayUser(result.user));
    return result.user;
  };
  const logout = async () => {
    await api('/auth/logout/', { method: 'POST' });
    setAccess(''); setUser(null); clearLegacyCredentials();
  };
  const reloadUser = async () => { const result = await api('/auth/me/'); setUser(displayUser(result)); return result; };
  const updateUser = async updates => {
    if (updates.plan && updates.plan.toLowerCase() !== 'bronze') throw new Error('Paid plans are not available yet. Choose Bronze to continue.');
    const body = {};
    for (const key of ['phone', 'whatsapp', 'lga', 'address', 'gender', 'bio', 'interests', 'email_notifications']) if (key in updates) body[key] = updates[key];
    if ('fullName' in updates) { const [first, ...last] = updates.fullName.trim().split(/\s+/); body.first_name = first; body.last_name = last.join(' '); }
    if ('dateOfBirth' in updates) body.date_of_birth = updates.dateOfBirth || null;
    let payload = body;
    if (updates.profilePicture?.startsWith('data:image/')) {
      payload = new FormData();
      for (const [key, value] of Object.entries(body)) {
        if (Array.isArray(value)) value.forEach(item => payload.append(key, item));
        else payload.append(key, value ?? '');
      }
      const image = await (await fetch(updates.profilePicture)).blob();
      payload.append('avatar', image, 'avatar.' + (image.type.split('/')[1] || 'png'));
    }
    const result = await api('/auth/me/', { method: 'PATCH', body: payload });
    setUser(displayUser(result)); return result;
  };
  return <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, login, logout, reloadUser, updateUser }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
