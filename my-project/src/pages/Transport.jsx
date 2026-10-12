import { Link } from 'react-router-dom';
import Seo from '@/components/seo/Seo';
import TransportHero from '@/components/Transport/TransportHero';
import TransportTabs from '@/components/Transport/TransportTabs';
import { useCollection } from '@/hooks/useApi';
import { panel, outline, TransportLoading } from '@/components/Transport/TransportUI';

export default function Transport() {
  const { data: companies, loading, error } = useCollection('/transport-companies/');
  return <main className="mx-auto max-w-7xl p-4 space-y-6"><Seo title="Transport in Abia" description="Compare scheduled bus journeys and event shuttles from approved transport companies." path="/transport" /><TransportHero /><TransportTabs /><div className="flex flex-wrap gap-3"><Link className={outline} to="/transport/company">Join / manage a transport company</Link><Link className={outline} to="/transport/bookings">My boarding passes</Link><Link className={outline} to="/transport/support">Transport support</Link></div><section><h2 className="text-2xl font-bold mb-4">Transport partners</h2>{loading ? <TransportLoading /> : error ? <p role="alert">{error.message}</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{companies.filter(c => c.status === 'APPROVED').map(c => <article className={panel} key={c.id}>{c.logo && <img src={c.logo} alt="" className="h-16 w-24 object-contain mb-3" loading="lazy" />}<h3 className="font-bold text-xl">{c.name}</h3><p className="my-3">{c.description}</p><Link className="text-green-700 underline" to={`/transport/shuttle?company=${c.id}`}>View journeys</Link></article>)}</div>}{!loading && !error && !companies.some(c => c.status === 'APPROVED') && <p>Partner journeys will appear here once companies are approved and schedules are published.</p>}</section></main>;
}
