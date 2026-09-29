import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Bell, Landmark, Moon, Shield, User } from "lucide-react";
import OrganizerShell from "./OrganizerPublicShell";
import PayoutAccountForm from "./PayoutAccountForm";
import ChangePasswordCard from "@/components/profile/ChangePasswordCard";
import PushPreferences from "@/components/pwa/PushPreferences";
import ThemeToggle from "@/components/ThemeToggle";
import PageSkeleton from "@/components/PageSkeleton";
import { useAuth } from "@/components/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { api } from "@/lib/api";

const tabs = [
  ["profile", "Profile Information", User],
  ["bank", "Bank Details", Landmark],
  ["notifications", "Notifications", Bell],
  ["appearance", "Appearance", Moon],
  ["security", "Password & Security", Shield],
];
const input =
  "mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-green-600";
const contactFields = [
  ["first_name", "First name", 150],
  ["last_name", "Last name", 150],
  ["phone", "Personal phone number", 20],
  ["address", "Address / location", 500],
];
const organizationFields = [
  ["business_name", "Organization / brand name", 200],
  ["contact_phone", "Business phone number", 20],
  ["event_type", "Event type", 100],
  ["coverage_region", "Coverage region", 200],
];

export default function OrganizerAccountSettings() {
  const { reloadUser } = useAuth();
  const { data, loading, error, reload } = useApi("/auth/organizer-profile/");
  const [tab, setTab] = useState("profile");
  const [contact, setContact] = useState({});
  const [details, setDetails] = useState({});
  const [busy, setBusy] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const logoObjectUrl = useRef(null);
  useEffect(() => () => { if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current); }, []);
  const selectLogo = file => {
    if (logoObjectUrl.current) URL.revokeObjectURL(logoObjectUrl.current);
    logoObjectUrl.current = file ? URL.createObjectURL(file) : null;
    setLogoFile(file);
    setLogoPreview(logoObjectUrl.current || "");
  };
  const reset = () => {
    if (data) {
      setContact(data.user);
      setDetails(data.organizer);
      selectLogo(null);
    }
  };
  useEffect(() => {
    if (data) {
      setContact(data.user);
      setDetails(data.organizer);
    }
  }, [data]);
  const save = async (event) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const fields =
      tab === "notifications"
        ? ["email_notifications"]
        : [...contactFields.map((row) => row[0]), "bio"];
    const body = {
      user: Object.fromEntries(fields.map((field) => [field, contact[field]])),
    };
    if (tab === "profile")
      body.organizer = Object.fromEntries(
        [...organizationFields.map((row) => row[0]), "description"].map(
          (field) => [field, details[field]],
        ),
      );
    try {
      await api("/auth/organizer-profile/", { method: "PATCH", body });
      if (tab === "profile" && logoFile) {
        const upload = new FormData();
        upload.append("logo", logoFile);
        await api("/auth/organizer-profile/", { method: "PATCH", body: upload });
        selectLogo(null);
      }
      reload();
      await reloadUser();
      toast.success("Your settings have been saved.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };
  const fields = (rows, values, update, required) =>
    rows.map(([field, label, limit]) => (
      <label key={field} className="text-sm font-medium">
        {label}
        <input
          required={required || field === "first_name"}
          type={field.includes("phone") ? "tel" : "text"}
          maxLength={limit}
          value={values[field] || ""}
          onChange={(e) => update({ ...values, [field]: e.target.value })}
          className={input}
          disabled={busy}
        />
      </label>
    ));
  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "Account Settings"]}
      title="Account Settings"
      subtitle="Manage your profile, bank account and preferences."
      actions={
        <Link
          to="/organizer/payouts"
          className="rounded-lg border border-input px-4 py-2 text-sm font-semibold"
        >
          View payouts
        </Link>
      }
    >
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <nav
          aria-label="Organizer settings"
          className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-3 lg:h-fit lg:flex-col"
        >
          {tabs.map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              disabled={busy}
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={`flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-bold ${tab === key ? "bg-[#EAF5EA] text-[#3F7D3D]" : "text-muted-foreground hover:bg-accent"}`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="min-w-0">
          {tab === "bank" ? (
            <PayoutAccountForm />
          ) : tab === "appearance" ? (
            <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold">Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Choose light or dark mode. Your choice is saved on this device.
              </p>
              <ThemeToggle />
            </section>
          ) : tab === "security" ? (
            <ChangePasswordCard />
          ) : loading ? (
            <PageSkeleton cards={1} />
          ) : error ? (
            <div role="alert" className="rounded-xl border p-6">
              <p>Your profile could not be loaded.</p>
              <button type="button" onClick={reload} className="mt-3 underline">
                Try again
              </button>
            </div>
          ) : (
            <form
              onSubmit={save}
              className="space-y-5 rounded-2xl border border-border bg-card p-5 text-card-foreground sm:p-6"
            >
              <h2 className="text-lg font-bold">
                {tab === "profile"
                  ? "Profile Information"
                  : "Notification Settings"}
              </h2>
              {tab === "profile" ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Update your contact details and the information shown for
                    your organization.
                  </p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields(contactFields, contact, setContact, false)}
                    <label className="text-sm font-medium sm:col-span-2">
                      Verified email
                      <input
                        value={data?.user.email || ""}
                        readOnly
                        type="email"
                        className={`${input} opacity-70`}
                      />
                    </label>
                    <label className="text-sm font-medium sm:col-span-2">
                      About you
                      <textarea
                        maxLength={2000}
                        rows={3}
                        value={contact.bio || ""}
                        onChange={(e) =>
                          setContact({ ...contact, bio: e.target.value })
                        }
                        className={input}
                        disabled={busy}
                      />
                    </label>
                  </div>
                  <h3 className="border-t border-border pt-5 font-semibold">
                    Organization
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    {(logoPreview || details.logo) && <img src={logoPreview || details.logo} alt="Organization logo" className="h-16 w-16 rounded-lg border border-border object-contain" />}
                    <label className="text-sm font-medium">Organization logo (optional)
                      <input type="file" accept="image/jpeg,image/png,image/webp" className={`${input} max-w-full`} onChange={event => { const file=event.target.files?.[0]; if (file && file.size>5*1024*1024) { toast.error("Images must be 5 MB or smaller."); event.target.value=""; return; } selectLogo(file || null); }} />
                    </label>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {fields(organizationFields, details, setDetails, true)}
                    <label className="text-sm font-medium sm:col-span-2">
                      Organization description
                      <textarea
                        rows={3}
                        maxLength={2000}
                        value={details.description || ""}
                        onChange={(e) =>
                          setDetails({
                            ...details,
                            description: e.target.value,
                          })
                        }
                        className={input}
                        disabled={busy}
                      />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                    <span>
                      <strong className="text-sm">Email updates</strong>
                      <span className="block text-xs text-muted-foreground">
                        Optional account updates. Verification and
                        password-reset emails remain available.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      className="h-5 w-5 shrink-0 accent-green-700"
                      checked={!!contact.email_notifications}
                      disabled={busy}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          email_notifications: e.target.checked,
                        })
                      }
                    />
                  </label>
                  <PushPreferences />
                </>
              )}
              <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                <button
                  disabled={busy}
                  className="min-h-11 rounded-lg bg-[#3F7D3D] px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  {busy ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={reset}
                  className="min-h-11 rounded-lg border border-input px-5 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </OrganizerShell>
  );
}
