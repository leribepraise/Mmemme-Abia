import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/components/context/AuthContext';
export function useBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const lock = useRef(false);
  const request = useRef(null);
  const [busy, setBusy] = useState(false);
  const book = async (kind, items, details = {}) => {
    if (lock.current) return;
    if (!user) { navigate('/login'); return; }
    if (!user.email_verified) { navigate('/verify-email'); return; }
    if (!user.phone) { toast.error('Add your phone number in Profile settings before booking.'); return; }
    const body = { kind, items, details, customer_name: user.fullName || user.email, customer_phone: user.phone };
    const signature = JSON.stringify(body);
    if (request.current?.signature !== signature) request.current = { signature, key: crypto.randomUUID() };
    lock.current = true; setBusy(true);
    try {
      const booking = await api('/bookings/', { method: 'POST', body, key: request.current.key });
      navigate(`${booking.status === 'CONFIRMED' ? '/Paymentsuccess' : '/Payment'}?booking=${booking.id}`, { state: { booking } });
      return booking;
    } catch (error) { toast.error(error.message); } finally { lock.current = false; setBusy(false); }
  };
  return { book, busy };
}
