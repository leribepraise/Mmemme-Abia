import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/components/context/AuthContext';
import MajorEventCard from '@/components/MajorEventCard';

export default function MajorEventSection() {
  const { user } = useAuth();
  const { data: promotion } = useApi(user ? '/events/major/' : null);
  if (!user || !promotion) return null;
  return <section className="mx-auto max-w-7xl px-4 py-8" aria-label="Major event">
    <div className="mb-4"><p className="text-sm font-bold uppercase tracking-wide text-[#ef6c19]">Don’t miss out</p><h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Major event</h2></div>
    <MajorEventCard promotion={promotion} compact />
  </section>;
}
