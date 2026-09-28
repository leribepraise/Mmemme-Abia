import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
export default function ContactForm() {
  const { user } = useAuth(); const navigate = useNavigate(); const [busy, setBusy] = useState(false);
  const openSupport = async () => {
    setBusy(true);
    try { const row = await api('/conversations/', { method:'POST', body:{support:true} }); navigate('/message?conversation='+row.id); }
    catch(error) { toast.error(error.message); } finally { setBusy(false); }
  };
  return <section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="text-xl font-bold">Message support</h2><p>Keep your question and replies together in your account. Include your booking reference when asking about a booking.</p>{user?<button disabled={busy} onClick={openSupport} className="rounded-lg bg-[#265F27] px-5 py-3 text-white">{busy?'Opening…':'Open support conversation'}</button>:<Link to="/login" className="inline-block rounded-lg bg-[#265F27] px-5 py-3 text-white">Sign in to contact support</Link>}</section>;
}
