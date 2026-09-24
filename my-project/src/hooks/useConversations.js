import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, allPages } from '@/lib/api';
import { useAuth } from '@/components/context/AuthContext';

export function useConversations() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [selectedId, setSelectedId] = useState(params.get('conversation') || '');
  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const lock = useRef(false);
  const currentId = useRef(selectedId);
  currentId.current = selectedId;
  const load = useCallback(async (signal) => {
    const rows = await allPages('/conversations/', { signal });
    if (signal?.aborted) return;
    setConversations(rows.map(row => {
      const name = String(row.customer) === String(user?.id) ? row.provider_name : row.customer_name;
      return { ...row, name, role: row.title, message: row.last_message || 'No messages yet', time: new Date(row.created_at).toLocaleDateString(), initials: name.split(/\s+/).slice(0, 2).map(part => part[0]).join(''), avatarTone: 'bg-[#3f7d3d]', avatar: '/logo.png', status: '' };
    }));
    setSelectedId(id => rows.some(row => row.id === id) ? id : rows[0]?.id || '');
  }, [user?.id]);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () => load(controller.signal).catch(error => { if (!controller.signal.aborted) toast.error(error.message, { id: 'conversations' }); });
    refresh();
    const timer = setInterval(() => { if (!document.hidden) refresh(); }, 15000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [load]);
  const loadThread = useCallback(async (id, signal) => {
    const rows = await allPages(`/conversations/${id}/messages/`, { signal });
    if (signal?.aborted || currentId.current !== id) return;
    setThread(rows.reverse().map(row => ({ ...row, sender: String(row.sender) === String(user?.id) ? 'admin' : 'user', text: row.body, time: new Date(row.created_at).toLocaleString() })));
  }, [user?.id]);
  useEffect(() => {
    setThread([]); setMessage('');
    if (!selectedId) return;
    const controller = new AbortController();
    const refresh = () => loadThread(selectedId, controller.signal).catch(error => { if (!controller.signal.aborted) toast.error(error.message, { id: 'conversation-thread' }); });
    refresh();
    const timer = setInterval(() => { if (!document.hidden) refresh(); }, 10000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [selectedId, loadThread]);
  const sendMessage = async () => {
    if (!selectedId || !message.trim() || lock.current) return;
    lock.current = true; setSending(true);
    const id = selectedId;
    try {
      await api(`/conversations/${id}/messages/`, { method: 'POST', body: { body: message.trim() } });
      if (currentId.current === id) setMessage('');
      await Promise.all([loadThread(id), load()]);
    } catch (error) { toast.error(error.message); }
    finally { lock.current = false; setSending(false); }
  };
  const markAsRead = async () => {
    if (!selectedId) return;
    try { await api(`/conversations/${selectedId}/read/`, { method: 'POST' }); await load(); }
    catch (error) { toast.error(error.message); }
  };
  const selectedChat = conversations.find(row => row.id === selectedId) || { id: '', name: 'Select a booking conversation', role: 'Start a conversation from My Bookings.', initials: '', avatarTone: 'bg-[#3f7d3d]', avatar: '/logo.png' };
  return { conversations, selectedId, selectedChat, selectConversation: row => setSelectedId(row.id), thread, message, setMessage, sendMessage, markAsRead, sending };
}
