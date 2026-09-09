import { useState } from "react";
import { Bell, CreditCard, KeyRound, Landmark, Link2, Shield, User } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import { seedOrganizer } from "@/data/organizerData";
import { load, save } from "@/lib/utils";

const TABS = [
  { key: "profile", label: "Profile Information", icon: User },
  { key: "password", label: "Change Password", icon: KeyRound },
  { key: "notifications", label: "Notification Settings", icon: Bell },
  { key: "payment", label: "Payment Details", icon: CreditCard },
  { key: "bank", label: "Bank Details", icon: Landmark },
  { key: "social", label: "Social Links", icon: Link2 },
  { key: "security", label: "Security", icon: Shield },
];

const LOCATIONS = ["Umuahia, Abia State", "Aba, Abia State", "Ohafia, Abia State", "Arochukwu, Abia State"];
const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#3F7D3D]";
const labelClass = "block text-xs font-bold text-gray-600 mb-1.5";
const BIO_LIMIT = 200;

export default function OrganizerSettings() {
  const [organizer, setOrganizer] = useState(() => load("mmemme-organizer", seedOrganizer));
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({ email: true, sms: false, security: true });

  const update = (key, value) => setOrganizer(prev => ({ ...prev, [key]: value }));
  const saveProfile = () => { save("mmemme-organizer", organizer); setSaved(true); setTimeout(() => setSaved(false), 1600); };

  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "Account Settings"]}
      title="Account Settings"
      subtitle="Manage your account details and preferences."
      actions={
        <>
          <button onClick={() => setOrganizer(load("mmemme-organizer", seedOrganizer))} className="px-5 py-2 rounded-lg text-sm font-bold text-gray-600 border border-gray-200 hover:bg-gray-50" data-testid="button-cancel-settings">
            Cancel
          </button>
          <button onClick={saveProfile} className="bg-[#3F7D3D] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#336633] transition-colors" data-testid="button-save-settings">
            {saved ? "Changes saved" : "Save Changes"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1 overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-3 lg:h-fit">
          {TABS.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2.5 text-left px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                tab === item.key ? "bg-[#EAF5EA] text-[#3F7D3D]" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid={`button-settings-${item.key}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {tab === "profile" ? (
            <>
              <h2 className="font-bold text-lg text-black mb-1">Profile Information</h2>
              <p className="text-sm text-gray-500 mb-6">Update your personal and organization information.</p>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="w-16 h-16 rounded-full bg-[#3F7D3D] text-white flex items-center justify-center font-black text-lg overflow-hidden shrink-0">
                  {organizer.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-black">Profile Photo</h3>
                  <p className="text-xs text-gray-500 mb-2">JPG, PNG or GIF. Max size 2MB.</p>
                  <button
                    onClick={() => window.alert("Choose a photo to upload.")}
                    className="text-xs font-bold border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
                    data-testid="button-upload-photo"
                  >
                    Upload New Photo
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div><label className={labelClass} htmlFor="profile-name">Full Name *</label><input id="profile-name" className={inputClass} value={organizer.name} onChange={e => update("name", e.target.value)} data-testid="input-profile-name" /></div>
                <div><label className={labelClass} htmlFor="profile-email">Email Address *</label><input id="profile-email" type="email" className={inputClass} value={organizer.email} onChange={e => update("email", e.target.value)} data-testid="input-profile-email" /></div>
                <div>
                  <label className={labelClass} htmlFor="profile-phone">Phone Number *</label>
                  <div className="flex">
                    <span className="flex items-center border border-r-0 border-gray-200 rounded-l-lg px-3 text-xs font-bold text-gray-500 bg-gray-50">NG</span>
                    <input id="profile-phone" className={`${inputClass} rounded-l-none`} value={organizer.phone} onChange={e => update("phone", e.target.value)} data-testid="input-profile-phone" />
                  </div>
                </div>
                <div><label className={labelClass} htmlFor="profile-org">Organization / Brand Name *</label><input id="profile-org" className={inputClass} value={organizer.organization} onChange={e => update("organization", e.target.value)} data-testid="input-profile-organization" /></div>
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass} htmlFor="profile-bio">Bio</label>
                    <span className="text-[10px] text-gray-400 font-medium">{organizer.bio.length}/{BIO_LIMIT}</span>
                  </div>
                  <textarea id="profile-bio" rows={3} maxLength={BIO_LIMIT} className={inputClass} value={organizer.bio} onChange={e => update("bio", e.target.value)} data-testid="textarea-profile-bio" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="profile-location">Location</label>
                  <select id="profile-location" className={inputClass} value={organizer.location} onChange={e => update("location", e.target.value)} data-testid="select-profile-location">
                    {LOCATIONS.map(loc => <option key={loc}>{loc}</option>)}
                  </select>
                </div>
              </div>
            </>
          ) : tab === "notifications" ? (
            <>
              <h2 className="font-bold text-lg text-black mb-1">Notification Settings</h2>
              <p className="text-sm text-gray-500 mb-6">Choose how Mmemme should keep you informed.</p>
              <div className="space-y-4">
                {[
                  ["email", "Email updates", "Event sales, approvals and guest activity"],
                  ["sms", "SMS reminders", "Time-sensitive alerts about your events"],
                  ["security", "Security notifications", "Sign-in and account changes"],
                ].map(([key, title, desc]) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div><strong className="text-sm font-bold text-black">{title}</strong><p className="text-xs text-gray-500">{desc}</p></div>
                    <button
                      onClick={() => setToggles(t => ({ ...t, [key]: !t[key] }))}
                      className={`w-11 h-6 rounded-full relative transition-colors ${toggles[key] ? "bg-[#3F7D3D]" : "bg-gray-200"}`}
                      aria-label={`Toggle ${title}`}
                      data-testid={`button-toggle-${key}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${toggles[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <h3 className="font-bold text-lg text-black">{TABS.find(t => t.key === tab)?.label}</h3>
              <p className="text-sm text-gray-400 mt-1 mb-4">This setting is ready to configure in your organizer workspace.</p>
              <button onClick={() => setTab("profile")} className="bg-[#3F7D3D] text-white px-5 py-2 rounded-lg text-sm font-bold" data-testid="button-back-profile">
                Back to profile
              </button>
            </div>
          )}
        </div>
      </div>
    </OrganizerShell>
  );
}
