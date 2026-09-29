import { useState } from "react";
import { Landmark } from "lucide-react";
import toast from "react-hot-toast";
import { useApi, useCollection } from "@/hooks/useApi";
import { api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";

export default function PayoutAccountForm({ onSaved }) {
  const { user } = useAuth();
  const {
    data: accounts,
    loading,
    error,
    reload,
  } = useCollection("/payout-accounts/");
  const account = accounts.find((row) => row.is_current);
  const [open, setOpen] = useState(false);
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const {
    data: banks,
    loading: banksLoading,
    error: bankError,
    reload: reloadBanks,
  } = useApi(open ? "/payout-accounts/banks/" : null);
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!bank || !/^[0-9]{10}$/.test(number)) {
      toast.error("Choose your bank and enter its 10-digit account number.");
      return;
    }
    setBusy(true);
    try {
      await api("/payout-accounts/", {
        method: "POST",
        body: { bank_code: bank, account_number: number },
      });
      setNumber("");
      setBank("");
      setOpen(false);
      reload();
      onSaved?.();
      toast.success("Bank account verified and submitted for staff approval.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Landmark size={20} />
          Payout bank account
        </h2>
        <button
          type="button"
          disabled={loading || busy}
          onClick={() => {
            reload();
            onSaved?.();
          }}
          className="min-h-11 text-sm underline"
        >
          Refresh account
        </button>
      </div>
      {loading ? (
        <div
          role="status"
          aria-label="Loading bank account"
          className="my-4 h-20 animate-pulse rounded-lg bg-muted"
        />
      ) : error ? (
        <div role="alert" className="my-4">
          <p>Unable to load your bank account.</p>
          <button type="button" onClick={reload} className="mt-2 underline">
            Try again
          </button>
        </div>
      ) : account ? (
        <div className="my-4 rounded-xl bg-muted p-4">
          <p className="break-words font-semibold">{account.account_name}</p>
          <p>
            {account.bank_name} · •••• {account.account_last4}
          </p>
          <p className="mt-2 text-sm">
            Status: <strong>{account.status.replaceAll("_", " ")}</strong>
          </p>
          {account.review_note && (
            <p className="mt-1 text-sm">{account.review_note}</p>
          )}
          {account.status === "PENDING" && (
            <p className="mt-2 text-sm text-muted-foreground">
              Your account is awaiting finance approval. You can request a
              payout once approved.
            </p>
          )}
        </div>
      ) : (
        <p className="my-4 text-sm text-muted-foreground">
          Add the Nigerian bank account that should receive your earnings.
        </p>
      )}
      {!user?.is_verified ? (
        <p className="text-sm text-muted-foreground">
          Your organizer account must be approved before you can add bank
          details.
        </p>
      ) : !open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={loading || !!error}
          className="min-h-11 rounded-lg bg-[#3F7D3D] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {account ? "Change payout account" : "Add payout account"}
        </button>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          {account && (
            <p className="text-sm text-muted-foreground">
              Changing accounts requires fresh approval. Existing payouts must
              be resolved first.
            </p>
          )}
          <label className="block text-sm font-medium">
            Bank
            <select
              required
              value={bank}
              onChange={(event) => setBank(event.target.value)}
              disabled={busy || banksLoading || !!bankError}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3"
            >
              <option value="">
                {banksLoading ? "Loading banks…" : "Select your bank"}
              </option>
              {(banks || []).map((row) => (
                <option key={row.code} value={row.code}>
                  {row.name}
                </option>
              ))}
            </select>
          </label>
          {bankError && (
            <div role="alert" className="text-sm">
              <p>Banks could not be loaded.</p>
              <button type="button" onClick={reloadBanks} className="underline">
                Retry bank list
              </button>
            </div>
          )}
          <label className="block text-sm font-medium">
            Account number
            <input
              required
              inputMode="numeric"
              autoComplete="off"
              pattern="[0-9]{10}"
              maxLength={10}
              value={number}
              onChange={(event) =>
                setNumber(event.target.value.replace(/[^0-9]/g, ""))
              }
              disabled={busy}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-3"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Paystack verifies the account holder's name before submission.
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              disabled={busy || banksLoading || !!bankError}
              className="min-h-11 rounded-lg bg-[#3F7D3D] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? "Verifying account…" : "Verify and submit account"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setOpen(false);
                setNumber("");
                setBank("");
              }}
              className="min-h-11 rounded-lg border border-input px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
