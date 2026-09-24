import { useRef } from "react";
import { useCollection, useApi } from "@/hooks/useApi";
import { api, downloadJSON } from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import { Banknote, Clock, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerShell";
import OrganizerStatCard from "@/components/organizer/OrganizerStatCard";
import { seedPayouts } from "@/data/organizerData";
import { naira, load, save } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const STATUS_STYLE = { Paid: "bg-green-100 text-green-700", Pending: "bg-amber-100 text-amber-700" };

export default function OrganizerPayouts() {
  const { data: rows, reload } = useCollection('/payouts/');
  const { data: summary, reload: reloadSummary } = useApi('/payouts/summary/');
  const { data: accounts } = useCollection('/payout-accounts/');
  const [busy, setBusy] = useState(false);
  const key = useRef(crypto.randomUUID());
  const payouts = rows.map(p => ({ ...p, amount: Number(p.amount), date: new Date(p.created_at).toLocaleDateString(), reference: p.latest_reference || p.id }));
  const requestPayout = async () => {
    if (busy) return;
    setBusy(true);
    try { await api('/payouts/', { method: 'POST', body: {}, key: key.current }); reload(); reloadSummary(); toast.success('Payout requested for finance review.'); key.current = crypto.randomUUID(); }
    catch (error) { toast.error(error.message); } finally { setBusy(false); }
  };

  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "Payouts"]}
      title="Payouts"
      subtitle="Know what has landed, what is moving and what is next."
      actions={
        <button
          onClick={requestPayout} disabled={busy}
          className="flex items-center gap-2 bg-[#3F7D3D] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#336633] transition-colors"
          data-testid="button-request-payout"
        >
          <Wallet className="w-4 h-4" /> Request Payout
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrganizerStatCard title="Available Balance" value={naira(Number(summary?.available_for_payout || 0))} trend="Ready to withdraw" icon={Wallet} plain />
        <OrganizerStatCard title="Total Paid Out" value={naira(Number(summary?.paid_out || 0))} trend="Completed payouts" icon={Banknote} plain />
        <OrganizerStatCard title="Pending" value={naira(Number(summary?.payouts_reserved || 0))} trend="Awaiting completion" icon={Clock} plain />
        <OrganizerStatCard title="Payout Account" value={accounts[0] ? `•• ${accounts[0].account_last4}` : "Not set"} trend={accounts[0]?.status || "Set up in Django admin"} icon={CreditCard} plain />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-black">Payout History</h2>
          <button
            onClick={() => { reload(); reloadSummary(); }}
            className="text-xs font-bold text-[#3F7D3D] hover:underline"
            data-testid="button-refresh-payouts"
          >
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                <th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Reference</th><th className="pb-3 pr-4">Amount</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map(p => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0" data-testid={`row-payout-${p.id}`}>
                  <td className="py-3 pr-4 text-gray-600">{p.date}</td>
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500">{p.reference}</td>
                  <td className="py-3 pr-4 font-bold text-black">{naira(p.amount)}</td>
                  <td className="py-3 pr-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_STYLE[p.status] || "bg-gray-100 text-gray-600"}`}>{p.status}</span></td>
                  <td className="py-3"><button onClick={() => downloadJSON(`payout-${p.id}`, p)} className="text-xs font-bold text-[#3F7D3D] hover:underline" data-testid={`button-receipt-${p.id}`}>Receipt</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#EAF5EA] rounded-2xl p-6 border border-[#c4e5c4] flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-[#3F7D3D] shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-black mb-1">Your payouts are protected</h3>
          <p className="text-sm text-gray-600">Every payout is verified against your ticket sales before it's released to your account.</p>
        </div>
      </div>
    </OrganizerShell>
  );
}