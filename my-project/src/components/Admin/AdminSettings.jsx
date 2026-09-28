import { Link } from 'react-router-dom';
import ChangePasswordCard from '../profile/ChangePasswordCard';
import PushPreferences from '../pwa/PushPreferences';

export default function AdminSettings() {
  return <div className="mx-auto max-w-3xl space-y-6">
    <h1 className="text-2xl font-bold">Admin settings</h1>
    <ChangePasswordCard />
    <PushPreferences />
    <section className="space-y-3 rounded-xl border bg-white p-5"><h2 className="font-bold">Platform management</h2>
      <Link className="block text-green-800 underline" to="/admin/subscriptions">Manage plan pricing and benefits</Link>
      <Link className="block text-green-800 underline" to="/admin/users">Manage accounts and activation</Link>
      <Link className="block text-green-800 underline" to="/admin/reports">Review reports and activity</Link>
    </section>
  </div>;
}
