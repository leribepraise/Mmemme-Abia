import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, allPages, money } from '@/lib/api';
import { useApi, useCollection } from '@/hooks/useApi';
import { panel, button, outline, TransportLoading } from './TransportUI';

export default function TransportFinance({ company }) {
  const { data: permissions, loading } = useApi('/payouts/summary/');
  const { data: payouts, error, reload } = useCollection(permissions?.can_release_payouts ? '/payouts/queue/' : null);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState(null);
  const act = async (payout, action) => {
    if (busy) return;
    const field = action === 'finalize' ? 'otp' : 'note';
    const value = action === 'reconcile' ? null : window.prompt(action === 'finalize' ? 'Enter the transfer OTP from Paystack. It will not be saved in the browser.' : `Explain why you want to ${action} this payout (at least 5 characters).`);
    if (action !== 'reconcile' && !value) return;
    setBusy(true);
    try { await api(`/payouts/${payout.id}/${action}/`, { method: 'POST', body: value ? { [field]: value } : {} }); reload(); toast.success(action === 'approve' ? 'Approved. The worker will submit the transfer.' : 'Payout updated.'); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  if (loading) return <TransportLoading />;
  if (!permissions?.can_release_payouts) return <p>Finance permission is required to review and release provider payouts.</p>;
  return <section className="space-y-4"><h2 className="text-xl font-bold">Provider payouts</h2><p className="text-sm">Payouts belong to this company owner’s provider account and may include their other services. Review the earnings allocations before approval. A different authorized finance staff member must approve them.</p><Link to="/admin/payments" className="underline text-green-700">View payments and refunds</Link>{error && <p role="alert">{error.message}</p>}{payouts.filter(p => p.provider === company.owner).map(p => <article className={panel} key={p.id}><h3 className="font-bold">{money(p.amount)} · {p.status}</h3><p>{p.account?.bank_name} · {p.account?.account_name} · ••••{p.account?.account_last4}</p><p className="text-xs break-all my-3">{p.id}</p><div className="flex flex-wrap gap-3"><button disabled={busy} className={outline} onClick={async () => { try { const rows = await allPages(`/payouts/${p.id}/items/`); setItems({ payout: p.id, rows }); } catch (e) { toast.error(e.message); } }}>Review earnings</button>{['REQUESTED', 'REVIEW'].includes(p.status) && <button className={button} disabled={busy} onClick={() => act(p, 'approve')}>Approve payout</button>}{['FAILED', 'REVERSED'].includes(p.status) && <button className={button} disabled={busy} onClick={() => act(p, 'retry')}>Approve retry</button>}{p.status === 'OTP_REQUIRED' && <button className={button} disabled={busy} onClick={() => act(p, 'finalize')}>Enter transfer OTP</button>}{p.latest_reference && <button className={outline} disabled={busy} onClick={() => act(p, 'reconcile')}>Check with Paystack</button>}{['REQUESTED', 'APPROVED', 'FAILED', 'REVERSED', 'REVIEW'].includes(p.status) && <button className={outline} disabled={busy} onClick={() => act(p, 'cancel')}>Cancel request</button>}</div>{items?.payout === p.id && <ul className="mt-4 space-y-2">{items.rows.map((row, i) => <li className="break-all text-sm" key={i}>{row.booking_reference} · {money(row.amount)} · {row.active ? 'Allocated' : 'Released'}</li>)}</ul>}</article>)}{!payouts.some(p => p.provider === company.owner) && <p>No payout requests for this provider.</p>}</section>;
}

