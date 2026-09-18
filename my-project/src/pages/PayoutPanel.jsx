import { useCallback, useEffect, useState } from "react";
import { api, money } from "../lib/api";
import { buttonClass, fieldClass, Notice } from "./Marketplace";

const statusLabel = value => value.replaceAll("_", " ").toLowerCase();
function Pager({ data, page, onChange, busy }) {
  return <div className="flex items-center gap-4"><button type="button" disabled={busy || !data?.previous} onClick={() => onChange(page - 1)}>Previous</button><span>Page {page}</span><button type="button" disabled={busy || !data?.next} onClick={() => onChange(page + 1)}>Next</button></div>;
}
function BankDetails({ account }) {
  return <div className="space-y-1"><p className="font-semibold">{account.provider_name || account.account_name}</p><p>{account.account_name} · {account.bank_name} · ending {account.account_last4}</p><p>Bank review: {statusLabel(account.status)}</p></div>;
}

export default function PayoutPanel() {
  const [summary, setSummary] = useState(null);
  const [account, setAccount] = useState(null);
  const [history, setHistory] = useState(null);
  const [page, setPage] = useState(1);
  const [bankQueue, setBankQueue] = useState(null);
  const [bankPage, setBankPage] = useState(1);
  const [queue, setQueue] = useState(null);
  const [queuePage, setQueuePage] = useState(1);
  const [banks, setBanks] = useState(null);
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");
  const [requestKey, setRequestKey] = useState(() => crypto.randomUUID());
  const [review, setReview] = useState(null);
  const [note, setNote] = useState("");
  const [otp, setOtp] = useState("");
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchData = useCallback(async () => {
    const [stats, accounts, own] = await Promise.all([api("/payouts/summary/"), api("/payout-accounts/"), api("/payouts/?page=" + page)]);
    const [bankReviews, payoutReviews] = await Promise.all([
      stats.can_review_banks ? api("/payout-accounts/queue/?page=" + bankPage) : null,
      stats.can_release_payouts ? api("/payouts/queue/?page=" + queuePage) : null,
    ]);
    return { stats, accounts, own, bankReviews, payoutReviews };
  }, [page, bankPage, queuePage]);
  const apply = useCallback(data => {
    setSummary(data.stats); setAccount(data.accounts.results[0] || null); setHistory(data.own);
    setBankQueue(data.bankReviews); setQueue(data.payoutReviews);
  }, []);
  const reload = useCallback(async () => apply(await fetchData()), [apply, fetchData]);
  useEffect(() => {
    let active = true;
    fetchData().then(data => { if (active) apply(data); }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [fetchData, apply]);
  async function run(work) {
    setBusy(true); setError(""); setNotice("");
    try { await work(); } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  function beginReview(kind, row, action) { setReview({ kind, row, action }); setNote(""); setOtp(""); }
  async function submitReview() {
    const { kind, row, action } = review;
    const path = kind === "bank" ? `/payout-accounts/${row.id}/review/` : `/payouts/${row.id}/${action}/`;
    const body = kind === "bank" ? { decision: action, note } : action === "finalize" ? { otp } : { note };
    await api(path, { method: "POST", body });
    setOtp(""); setReview(null); setNotice("Finance action recorded. Refresh to see the latest transfer status."); await reload();
  }
  async function viewItems(row, itemPage = 1) {
    const data = await api(`/payouts/${row.id}/items/?page=${itemPage}`);
    setItems({ row, data, page: itemPage });
  }

  return <section className="space-y-5 border-t pt-8" aria-labelledby="payout-title">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 id="payout-title" className="text-2xl font-bold">Provider payouts</h2><button type="button" className="underline" disabled={busy} onClick={() => run(reload)}>Refresh payouts</button></div>
    <Notice error={error} />{notice && <p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">{notice}</p>}
    {summary && <><p>Earnings become eligible {summary.hold_days} days after a completed service. Bank details and each payout require staff approval.</p>
      <div className="grid gap-4 sm:grid-cols-3">{[["Eligible earnings", summary.available_for_payout], ["Requested or awaiting payment", summary.payouts_reserved], ["Paid to your bank", summary.paid_out]].map(([label, value]) => <div key={label} className="rounded-xl border bg-white p-4"><p>{label}</p><strong className="text-xl">{money(value)}</strong></div>)}</div>
      {!summary.transfers_enabled && <p className="rounded-lg bg-amber-50 p-3 text-amber-900">Bank transfers are not enabled yet. Approved requests will wait until the finance team enables them.</p>}
    </>}
    <div className="space-y-3 rounded-xl border bg-white p-5"><h3 className="text-lg font-bold">Your payout bank account</h3>
      {account ? <><BankDetails account={account} />{account.review_note && <p>{account.review_note}</p>}</> : <p>{summary ? "No bank account submitted." : "Loading payout details…"}</p>}
      <button type="button" className="underline" disabled={busy} onClick={() => run(async () => setBanks(await api("/payout-accounts/banks/")))}>{account ? "Change bank details" : "Add bank details"}</button>
      {banks && <form className="space-y-3" onSubmit={e => { e.preventDefault(); run(async () => {
        await api("/payout-accounts/", { method: "POST", body: { bank_code: bank, account_number: number } });
        setNumber(""); setBanks(null); await reload(); setNotice("Bank details verified with Paystack and submitted for staff review.");
      }); }}>
        <label className="block">Bank<select required className={fieldClass} value={bank} onChange={e => setBank(e.target.value)}><option value="">Choose your bank</option>{banks.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}</select></label>
        <label className="block">10-digit account number<input required autoComplete="off" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} className={fieldClass} value={number} onChange={e => setNumber(e.target.value)} /></label>
        <p className="text-sm text-gray-600">Paystack verifies the account name. Mmemme Abia keeps the bank name and last four digits. Changes require a new review and cannot be made while a payout is outstanding.</p>
        <button className={buttonClass} disabled={busy}>Verify and submit bank details</button><button type="button" className="ml-4 underline" onClick={() => { setBanks(null); setNumber(""); }}>Close</button>
      </form>}
    </div>
    <button type="button" className={buttonClass} disabled={busy || account?.status !== "APPROVED" || !(Number(summary?.available_for_payout) > 0)} onClick={() => run(async () => {
      const result = await api("/payouts/", { method: "POST", key: requestKey, body: {} });
      setRequestKey(crypto.randomUUID()); await reload(); setNotice(`Payout of ${money(result.amount)} submitted for staff approval.`);
    })}>Request payout of eligible earnings</button>
    <div className="space-y-3"><h3 className="text-lg font-bold">Your payout history</h3>{history?.count === 0 && <p>No payouts requested yet.</p>}{history?.results.map(row => <article key={row.id} className="space-y-2 rounded-xl border bg-white p-4"><p className="font-semibold">{money(row.amount)} · {statusLabel(row.status)}</p><p>{row.account.bank_name} · ending {row.account.account_last4}</p>{row.latest_reference && <p className="break-all text-sm">{row.latest_reference}</p>}<button type="button" className="underline" disabled={busy} onClick={() => run(() => viewItems(row))}>View included bookings</button></article>)}<Pager data={history} page={page} onChange={setPage} busy={busy} /></div>
    {bankQueue && <div className="space-y-3 rounded-xl border p-5"><h3 className="text-xl font-bold">Finance: bank account reviews</h3>{bankQueue.count === 0 && <p>No accounts to review.</p>}{bankQueue.results.map(row => <article key={row.id} className="space-y-3 border-b pb-4"><BankDetails account={row} /><div className="flex flex-wrap gap-4">{["APPROVED", "REJECTED", "SUSPENDED"].filter(value => value !== row.status).map(value => <button type="button" disabled={busy} className="underline" key={value} onClick={() => beginReview("bank", row, value)}>{value === "APPROVED" ? "Approve bank" : value === "REJECTED" ? "Reject bank" : "Suspend payouts to bank"}</button>)}</div></article>)}<Pager data={bankQueue} page={bankPage} onChange={setBankPage} busy={busy} /></div>}
    {queue && <div className="space-y-4 rounded-xl border p-5"><h3 className="text-xl font-bold">Finance: payout review and release</h3><p>Check service delivery, disputes and available merchant funds before approving a transfer. Approval permits the worker to send money once transfers are enabled.</p>{queue.count === 0 && <p>No payout requests.</p>}{queue.results.map(row => <article key={row.id} className="space-y-3 border-b pb-4"><p className="font-bold">{money(row.amount)} · {statusLabel(row.status)}</p><BankDetails account={row.account} />{row.latest_reference && <p className="break-all text-sm">{row.latest_reference}</p>}<div className="flex flex-wrap gap-4"><button type="button" className="underline" disabled={busy} onClick={() => run(() => viewItems(row))}>View included bookings</button>
      {["REQUESTED", "REVIEW"].includes(row.status) && !row.latest_reference && <button type="button" className="underline" disabled={busy} onClick={() => beginReview("payout", row, "approve")}>Approve {money(row.amount)}</button>}
      {["FAILED", "REVERSED"].includes(row.status) && <button type="button" className="underline" disabled={busy} onClick={() => beginReview("payout", row, "retry")}>Review retry</button>}
      {["REQUESTED", "APPROVED", "FAILED", "REVERSED"].includes(row.status) && <button type="button" className="underline" disabled={busy} onClick={() => beginReview("payout", row, "cancel")}>Cancel payout request</button>}
      {row.status === "OTP_REQUIRED" && <button type="button" className="underline" disabled={busy} onClick={() => beginReview("payout", row, "finalize")}>Enter transfer OTP</button>}
      {row.latest_reference && <button type="button" className="underline" disabled={busy} onClick={() => run(async () => { await api(`/payouts/${row.id}/reconcile/`, { method: "POST", body: {} }); await reload(); })}>Check with Paystack</button>}
    </div></article>)}<Pager data={queue} page={queuePage} onChange={setQueuePage} busy={busy} /></div>}
    {review && <form className="space-y-3 rounded-xl border-2 border-purple-600 bg-white p-5" onSubmit={e => { e.preventDefault(); run(submitReview); }}><h3 className="text-xl font-bold">{review.kind === "bank" ? "Confirm bank review" : "Confirm payout action"}</h3><p>Action: {statusLabel(review.action)}{review.row.amount && ` · ${money(review.row.amount)}`}</p><BankDetails account={review.kind === "bank" ? review.row : review.row.account} />
      {review.action === "finalize" ? <label className="block">Paystack transfer OTP<input required type="password" autoComplete="off" inputMode="numeric" pattern="[0-9]{4,10}" className={fieldClass} value={otp} onChange={e => setOtp(e.target.value)} /></label> : <label className="block">Review note (visible to the provider)<textarea required minLength={5} maxLength={500} className={fieldClass} value={note} onChange={e => setNote(e.target.value)} /></label>}
      <button className={buttonClass} disabled={busy}>Confirm action</button><button type="button" className="ml-4 underline" onClick={() => { setReview(null); setOtp(""); }}>Close</button>
    </form>}
    {items && <div className="space-y-3 rounded-xl border bg-white p-5"><h3 className="font-bold">Bookings included in {money(items.row.amount)}</h3>{items.data.results.map(row => <p key={row.booking_reference}>{row.booking_reference}: {money(row.amount)}{!row.active && " · reservation released"}</p>)}<Pager data={items.data} page={items.page} onChange={value => run(() => viewItems(items.row, value))} busy={busy} /><button type="button" className="underline" onClick={() => setItems(null)}>Close bookings</button></div>}
  </section>;
}
