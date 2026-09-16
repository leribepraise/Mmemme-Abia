import { useEffect, useState } from "react";
import {
  Banknote, Check, ChevronDown, CreditCard, Copy, Pencil, Percent, Plus,
  ReceiptText, Search, Settings2, Tag, Ticket, Trash2, X,
} from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import OrganizerStatCard from "@/components/organizer/OrganizerStatCard";
import {
  seedEvents, seedTicketTypes, seedDiscounts, seedPromoCodes, seedTicketSettings,
} from "@/data/organizerData";
import { naira, fmtDate, load, save } from "@/lib/utils";

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3F7D3D]";
const labelClass = "block text-[11px] font-bold text-gray-500 mb-1";

const TABS = [
  { key: "types", label: "Ticket Types", icon: Ticket },
  { key: "discounts", label: "Discounts", icon: Percent },
  { key: "promos", label: "Promo Codes", icon: Tag },
  { key: "settings", label: "Ticket Settings", icon: Settings2 },
  { key: "sales", label: "Sales Report", icon: ReceiptText },
];

function defaultTicketTypes(event) {
  return [{ id: `tt-${event.id}`, name: "Regular", description: "General admission", price: 5000, sold: event.ticketsSold, limit: event.ticketCapacity, status: event.ticketsSold >= event.ticketCapacity ? "Sold Out" : "Active" }];
}

function StatusPill({ status }) {
  const style = status === "Active" ? "bg-green-100 text-green-700" : status === "Sold Out" ? "bg-red-100 text-red-700" : status === "Expired" ? "bg-gray-100 text-gray-500" : "bg-amber-100 text-amber-700";
  return <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${style}`}>{status}</span>;
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-[#3F7D3D]" aria-label="Edit" data-testid="button-row-edit">
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600" aria-label="Delete" data-testid="button-row-delete">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function TicketTypesPanel({ event, onReady }) {
  const [items, setItems] = useState(() => {
    const store = load("mmemme-ticket-types", {});
    return store[event.id] || seedTicketTypes[event.id] || defaultTicketTypes(event);
  });
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", description: "", price: "", limit: "" });

  const persist = (next) => {
    setItems(next);
    const store = load("mmemme-ticket-types", {});
    save("mmemme-ticket-types", { ...store, [event.id]: next });
  };

  const startAdd = () => { setAdding(true); setEditingId(null); setDraft({ name: "", description: "", price: "", limit: "" }); };
  const startEdit = (item) => { setEditingId(item.id); setAdding(false); setDraft(item); };
  const cancel = () => { setAdding(false); setEditingId(null); };

  const submit = () => {
    if (!draft.name.trim() || !draft.price || !draft.limit) return;
    if (editingId) {
      persist(items.map(i => (i.id === editingId ? { ...i, ...draft, price: Number(draft.price), limit: Number(draft.limit) } : i)));
    } else {
      persist([...items, { id: `tt-${Date.now()}`, name: draft.name, description: draft.description, price: Number(draft.price), sold: 0, limit: Number(draft.limit), status: "Active" }]);
    }
    cancel();
  };

  const remove = (id) => { if (window.confirm("Remove this ticket type?")) persist(items.filter(i => i.id !== id)); };

  useEffect(() => { onReady?.({ startAdd }); }, [event.id]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
              <th className="pb-3 pr-4">Ticket Type</th><th className="pb-3 pr-4">Price</th><th className="pb-3 pr-4">Available</th><th className="pb-3 pr-4">Sold</th><th className="pb-3 pr-4">Limit</th><th className="pb-3 pr-4">Status</th><th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              editingId === item.id ? (
                <tr key={item.id} className="border-b border-gray-50 bg-[#F7FBF7]" data-testid={`row-edit-${item.id}`}>
                  <td className="py-2.5 pr-4">
                    <input className={inputClass} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Name" />
                    <input className={`${inputClass} mt-1.5`} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Description" />
                  </td>
                  <td className="py-2.5 pr-4"><input type="number" className={inputClass} value={draft.price} onChange={e => setDraft(d => ({ ...d, price: e.target.value }))} /></td>
                  <td className="py-2.5 pr-4 text-gray-400">{Math.max(0, (Number(draft.limit) || 0) - item.sold)}</td>
                  <td className="py-2.5 pr-4 text-gray-600">{item.sold}</td>
                  <td className="py-2.5 pr-4"><input type="number" className={inputClass} value={draft.limit} onChange={e => setDraft(d => ({ ...d, limit: e.target.value }))} /></td>
                  <td className="py-2.5 pr-4"><StatusPill status={item.status} /></td>
                  <td className="py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={submit} className="p-1.5 text-[#3F7D3D] hover:text-[#336633]" aria-label="Save" data-testid={`button-save-${item.id}`}><Check className="w-3.5 h-3.5" /></button>
                      <button onClick={cancel} className="p-1.5 text-gray-400 hover:text-gray-700" aria-label="Cancel"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={item.id} className="border-b border-gray-50 last:border-0" data-testid={`row-ticket-type-${item.id}`}>
                  <td className="py-3 pr-4"><strong className="font-bold text-black">{item.name}</strong><p className="text-[10px] text-gray-400">{item.description}</p></td>
                  <td className="py-3 pr-4 font-bold text-black">{naira(item.price)}</td>
                  <td className="py-3 pr-4 text-gray-600">{Math.max(0, item.limit - item.sold)}</td>
                  <td className="py-3 pr-4 text-gray-600">{item.sold}</td>
                  <td className="py-3 pr-4 text-gray-600">{item.limit}</td>
                  <td className="py-3 pr-4"><StatusPill status={item.sold >= item.limit ? "Sold Out" : item.status} /></td>
                  <td className="py-3"><RowActions onEdit={() => startEdit(item)} onDelete={() => remove(item.id)} /></td>
                </tr>
              )
            ))}
            {adding && (
              <tr className="border-b border-gray-50 bg-[#F7FBF7]" data-testid="row-add-ticket-type">
                <td className="py-2.5 pr-4">
                  <input className={inputClass} autoFocus value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. VIP" data-testid="input-new-ticket-name" />
                  <input className={`${inputClass} mt-1.5`} value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Short description" />
                </td>
                <td className="py-2.5 pr-4"><input type="number" className={inputClass} value={draft.price} onChange={e => setDraft(d => ({ ...d, price: e.target.value }))} placeholder="0" data-testid="input-new-ticket-price" /></td>
                <td className="py-2.5 pr-4 text-gray-300">—</td>
                <td className="py-2.5 pr-4 text-gray-300">0</td>
                <td className="py-2.5 pr-4"><input type="number" className={inputClass} value={draft.limit} onChange={e => setDraft(d => ({ ...d, limit: e.target.value }))} placeholder="0" data-testid="input-new-ticket-limit" /></td>
                <td className="py-2.5 pr-4"><StatusPill status="Active" /></td>
                <td className="py-2.5">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={submit} className="p-1.5 text-[#3F7D3D] hover:text-[#336633]" aria-label="Save" data-testid="button-save-new-ticket"><Check className="w-3.5 h-3.5" /></button>
                    <button onClick={cancel} className="p-1.5 text-gray-400 hover:text-gray-700" aria-label="Cancel"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-400 font-medium mt-4 pt-4 border-t border-gray-50">Note: Changes to ticket types will reflect on the event page immediately.</p>
    </div>
  );
}

function DiscountsPanel({ event }) {
  const [items, setItems] = useState(() => {
    const store = load("mmemme-discounts", {});
    return store[event.id] || seedDiscounts[event.id] || [];
  });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: "", type: "Percentage", value: "", appliesTo: "" });

  const persist = (next) => {
    setItems(next);
    const store = load("mmemme-discounts", {});
    save("mmemme-discounts", { ...store, [event.id]: next });
  };

  const submit = () => {
    if (!draft.name.trim() || !draft.value) return;
    persist([...items, { id: `dc-${Date.now()}`, ...draft, value: Number(draft.value), status: "Active" }]);
    setAdding(false);
    setDraft({ name: "", type: "Percentage", value: "", appliesTo: "" });
  };
  const toggle = (id) => persist(items.map(i => (i.id === id ? { ...i, status: i.status === "Active" ? "Inactive" : "Active" } : i)));
  const remove = (id) => { if (window.confirm("Remove this discount?")) persist(items.filter(i => i.id !== id)); };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="font-bold text-lg text-black">Discounts</h2>
          <p className="text-sm text-gray-500">Reward group bookings and repeat attendees.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 bg-[#3F7D3D] hover:bg-[#336633] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm" data-testid="button-add-discount">
          <Plus className="w-4 h-4" /> Add Discount
        </button>
      </div>

      <div className="divide-y divide-gray-50 mt-5">
        {items.length === 0 && !adding && <p className="text-sm text-gray-400 py-8 text-center">No discounts yet for this event.</p>}
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between py-3.5" data-testid={`row-discount-${item.id}`}>
            <div>
              <p className="font-bold text-sm text-black">{item.name}</p>
              <p className="text-[11px] text-gray-500">{item.type === "Percentage" ? `${item.value}% off` : naira(item.value)} &middot; applies to {item.appliesTo || "all tickets"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggle(item.id)} data-testid={`button-toggle-discount-${item.id}`}><StatusPill status={item.status} /></button>
              <RowActions onEdit={() => {}} onDelete={() => remove(item.id)} />
            </div>
          </div>
        ))}
        {adding && (
          <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div><label className={labelClass}>Name</label><input className={inputClass} value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="e.g. Group of 5+" data-testid="input-discount-name" /></div>
            <div>
              <label className={labelClass}>Type</label>
              <select className={inputClass} value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))}>
                <option>Percentage</option><option>Fixed</option>
              </select>
            </div>
            <div><label className={labelClass}>{draft.type === "Percentage" ? "Value (%)" : "Value (\u20a6)"}</label><input type="number" className={inputClass} value={draft.value} onChange={e => setDraft(d => ({ ...d, value: e.target.value }))} data-testid="input-discount-value" /></div>
            <div className="flex gap-2">
              <button onClick={submit} className="flex-1 bg-[#3F7D3D] text-white rounded-lg py-2 text-sm font-bold" data-testid="button-save-discount">Save</button>
              <button onClick={() => setAdding(false)} className="px-3 rounded-lg border border-gray-200 text-gray-500 text-sm font-bold">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PromoCodesPanel({ event }) {
  const [items, setItems] = useState(() => {
    const store = load("mmemme-promo-codes", {});
    return store[event.id] || seedPromoCodes[event.id] || [];
  });
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ code: "", discount: "", limit: "", expiry: "" });
  const [copiedId, setCopiedId] = useState(null);

  const persist = (next) => {
    setItems(next);
    const store = load("mmemme-promo-codes", {});
    save("mmemme-promo-codes", { ...store, [event.id]: next });
  };

  const submit = () => {
    if (!draft.code.trim() || !draft.discount.trim()) return;
    persist([...items, { id: `pc-${Date.now()}`, code: draft.code.toUpperCase(), discount: draft.discount, uses: 0, limit: Number(draft.limit) || 100, expiry: draft.expiry, status: "Active" }]);
    setAdding(false);
    setDraft({ code: "", discount: "", limit: "", expiry: "" });
  };
  const remove = (id) => { if (window.confirm("Remove this promo code?")) persist(items.filter(i => i.id !== id)); };
  const copy = (item) => {
    navigator.clipboard?.writeText(item.code).catch(() => {});
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="font-bold text-lg text-black">Promo Codes</h2>
          <p className="text-sm text-gray-500">Share a code for marketing pushes and partners.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 bg-[#3F7D3D] hover:bg-[#336633] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm" data-testid="button-add-promo">
          <Plus className="w-4 h-4" /> Add Promo Code
        </button>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
              <th className="pb-3 pr-4">Code</th><th className="pb-3 pr-4">Discount</th><th className="pb-3 pr-4">Uses</th><th className="pb-3 pr-4">Expiry</th><th className="pb-3 pr-4">Status</th><th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-50 last:border-0" data-testid={`row-promo-${item.id}`}>
                <td className="py-3 pr-4">
                  <button onClick={() => copy(item)} className="flex items-center gap-1.5 font-mono font-bold text-black" data-testid={`button-copy-${item.id}`}>
                    {item.code} <Copy className="w-3 h-3 text-gray-400" /> {copiedId === item.id && <span className="text-[10px] text-[#3F7D3D] font-sans font-bold">Copied</span>}
                  </button>
                </td>
                <td className="py-3 pr-4 text-gray-600">{item.discount}</td>
                <td className="py-3 pr-4 text-gray-600">{item.uses}/{item.limit}</td>
                <td className="py-3 pr-4 text-gray-600">{item.expiry ? fmtDate(item.expiry) : "—"}</td>
                <td className="py-3 pr-4"><StatusPill status={item.status} /></td>
                <td className="py-3"><RowActions onEdit={() => {}} onDelete={() => remove(item.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && !adding && <p className="text-sm text-gray-400 py-8 text-center">No promo codes yet for this event.</p>}
        {adding && (
          <div className="pt-5 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div><label className={labelClass}>Code</label><input className={`${inputClass} uppercase`} value={draft.code} onChange={e => setDraft(d => ({ ...d, code: e.target.value }))} placeholder="e.g. SBLC10" data-testid="input-promo-code" /></div>
            <div><label className={labelClass}>Discount</label><input className={inputClass} value={draft.discount} onChange={e => setDraft(d => ({ ...d, discount: e.target.value }))} placeholder="e.g. 10% off" data-testid="input-promo-discount" /></div>
            <div><label className={labelClass}>Usage Limit</label><input type="number" className={inputClass} value={draft.limit} onChange={e => setDraft(d => ({ ...d, limit: e.target.value }))} placeholder="100" /></div>
            <div><label className={labelClass}>Expiry</label><input type="date" className={inputClass} value={draft.expiry} onChange={e => setDraft(d => ({ ...d, expiry: e.target.value }))} /></div>
            <div className="md:col-span-4 flex gap-2">
              <button onClick={submit} className="bg-[#3F7D3D] text-white rounded-lg px-5 py-2 text-sm font-bold" data-testid="button-save-promo">Save Code</button>
              <button onClick={() => setAdding(false)} className="px-4 rounded-lg border border-gray-200 text-gray-500 text-sm font-bold">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TicketSettingsPanel() {
  const [settings, setSettings] = useState(() => load("mmemme-ticket-settings", seedTicketSettings));
  const [saved, setSaved] = useState(false);
  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const submit = () => { save("mmemme-ticket-settings", settings); setSaved(true); setTimeout(() => setSaved(false), 1500); };

  const toggles = [
    ["allowTransfers", "Allow ticket transfers", "Let attendees reassign a ticket to someone else."],
    ["enableWaitlist", "Enable waitlist when sold out", "Collect interested buyers once a ticket type sells out."],
    ["requireAttendeeInfo", "Require attendee info at checkout", "Ask for each attendee's name and email, not just the buyer's."],
    ["hideRemainingCount", "Hide remaining ticket count", "Don't show \"X left\" publicly on the event page."],
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-lg text-black mb-1">Ticket Settings</h2>
      <p className="text-sm text-gray-500 mb-5">Control how tickets behave for this event.</p>
      <div className="space-y-4">
        {toggles.map(([key, title, desc]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div><strong className="text-sm font-bold text-black">{title}</strong><p className="text-xs text-gray-500">{desc}</p></div>
            <button
              onClick={() => toggle(key)}
              className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${settings[key] ? "bg-[#3F7D3D]" : "bg-gray-200"}`}
              aria-label={`Toggle ${title}`}
              data-testid={`button-toggle-${key}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings[key] ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
        <div className="flex items-center justify-between py-3">
          <div><strong className="text-sm font-bold text-black">Close ticket sales before event</strong><p className="text-xs text-gray-500">Stop new purchases this many hours before the event starts.</p></div>
          <input
            type="number"
            min="0"
            className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-right focus:outline-none focus:border-[#3F7D3D]"
            value={settings.salesCloseHours}
            onChange={e => setSettings(s => ({ ...s, salesCloseHours: Number(e.target.value) }))}
            data-testid="input-sales-close-hours"
          />
        </div>
      </div>
      <button onClick={submit} className="mt-5 bg-[#3F7D3D] hover:bg-[#336633] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm" data-testid="button-save-ticket-settings">
        {saved ? "Settings saved" : "Save Settings"}
      </button>
    </div>
  );
}

function SalesReportPanel() {
  const events = load("mmemme-events", seedEvents);
  const [search, setSearch] = useState("");
  const sales = events
    .flatMap((e, index) => [{
      id: `sale-${index}1`,
      event: e.title,
      buyer: ["Adaeze Kalu", "Daniel Chukwu", "Nneoma Eze"][index % 3],
      ticket: index % 2 ? "VIP Pass" : "Regular Pass",
      amount: index % 2 ? 12000 : 7000,
      date: fmtDate(e.date),
    }])
    .filter(s => s.event.toLowerCase().includes(search.toLowerCase()) || s.buyer.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OrganizerStatCard title="Gross Sales" value={naira(4560000)} trend="+15%" icon={Banknote} />
        <OrganizerStatCard title="Tickets Sold" value="1,245" trend="+18%" icon={Ticket} />
        <OrganizerStatCard title="Average Order" value={naira(8340)} trend="+6.4%" icon={ReceiptText} />
        <OrganizerStatCard title="Refunds" value={naira(48000)} trend="-2.1%" isPositive={false} icon={CreditCard} />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search by buyer or event"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#3F7D3D]"
            data-testid="input-search-sales"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                <th className="pb-3 pr-4">Buyer</th><th className="pb-3 pr-4">Event</th><th className="pb-3 pr-4">Ticket Type</th><th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Amount</th><th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {sales.map(s => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0" data-testid={`row-sale-${s.id}`}>
                  <td className="py-3 pr-4"><strong className="font-bold text-black">{s.buyer}</strong><div className="text-[10px] text-gray-400">Order {s.id.toUpperCase()}</div></td>
                  <td className="py-3 pr-4 text-gray-600">{s.event}</td>
                  <td className="py-3 pr-4 text-gray-600">{s.ticket}</td>
                  <td className="py-3 pr-4 text-gray-600">{s.date}</td>
                  <td className="py-3 pr-4 font-bold text-black">{naira(s.amount)}</td>
                  <td className="py-3"><span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function OrganizerTicketSales() {
  const events = load("mmemme-events", seedEvents);
  const [eventId, setEventId] = useState(events[0]?.id);
  const event = events.find(e => e.id === eventId) || events[0];
  const [tab, setTab] = useState("types");
  const [typesApi, setTypesApi] = useState(null);

  return (
    <OrganizerShell
      breadcrumb={["Home", "Organizer", "Ticket Management"]}
      title="Ticket Management"
      subtitle="Create and manage tickets for your event."
      actions={
        tab === "types" && (
          <button
            onClick={() => typesApi?.startAdd()}
            className="flex items-center gap-1.5 bg-[#3F7D3D] hover:bg-[#336633] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
            data-testid="button-add-ticket-type"
          >
            <Plus className="w-4 h-4" /> Add Ticket Type
          </button>
        )
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1 overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-3 lg:h-fit">
          {TABS.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2.5 text-left px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                tab === item.key ? "bg-[#EAF5EA] text-[#3F7D3D]" : "text-gray-600 hover:bg-gray-50"
              }`}
              data-testid={`button-tab-${item.key}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img src={event.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="relative inline-flex items-center gap-1.5">
                <select
                  value={eventId}
                  onChange={e => setEventId(e.target.value)}
                  className="font-bold text-sm text-black bg-transparent focus:outline-none appearance-none pr-5"
                  data-testid="select-ticket-management-event"
                >
                  {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 pointer-events-none -ml-5" />
              </div>
              <p className="text-[11px] text-gray-500 font-medium">{fmtDate(event.date)} &middot; {event.venue}</p>
            </div>
            <StatusPill status={event.status} />
          </div>

          {tab === "types" && <TicketTypesPanel event={event} onReady={setTypesApi} key={`types-${event.id}`} />}
          {tab === "discounts" && <DiscountsPanel event={event} key={`discounts-${event.id}`} />}
          {tab === "promos" && <PromoCodesPanel event={event} key={`promos-${event.id}`} />}
          {tab === "settings" && <TicketSettingsPanel />}
          {tab === "sales" && <SalesReportPanel />}
        </div>
      </div>
    </OrganizerShell>
  );
}
