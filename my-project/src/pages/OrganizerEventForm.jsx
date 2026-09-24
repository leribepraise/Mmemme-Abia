import { useCollection } from "@/hooks/useApi";
import { organizerEvent } from "@/lib/catalog";
import { api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ImagePlus, ShieldCheck } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import { seedEvents } from "@/data/organizerData";
import { load, naira, save } from "@/lib/utils";

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#3F7D3D] bg-white";
const labelClass = "block text-xs font-bold text-gray-700 mb-2";
const STEPS = ["Basic Info", "Date & Venue", "Tickets & Pricing", "Media", "Preview & Publish"];

function Stepper({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  done ? "bg-[#3F7D3D] text-white" : active ? "bg-[#3F7D3D] text-white shadow-sm" : "bg-white border border-gray-300 text-gray-400"
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : step}
              </div>
              <span className={`text-xs font-bold whitespace-nowrap ${active ? "text-black" : "text-gray-400"}`}>{label}</span>
            </div>
            {step < STEPS.length && <div className={`flex-1 h-0.5 mx-3 mb-5 ${done ? "bg-[#3F7D3D]" : "bg-gray-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function OrganizerEventForm({ editId }) {
  const navigate = useNavigate();
  const { data: events } = useCollection("/events/mine/", organizerEvent);
  const existing = editId ? events.find(e => e.id === editId) : undefined;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: existing?.title || "",
    category: existing?.category || "Music",
    eventType: existing?.eventType || "Physical Event",
    description: existing?.description || "",
    tags: existing?.tags?.join(", ") || "",
    date: existing?.date || "",
    venue: existing?.venue || "",
    price: String(existing?.price || 5000),
    capacity: String(existing?.ticketCapacity || 500),
    image: existing?.image || "",
  });
  const [saved, setSaved] = useState(false);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const canAdvance = () => {
    if (step === 1) return form.title.trim() && form.description.trim();
    if (step === 2) return form.venue.trim() && form.date;
    return true;
  };

  const createdId = useRef(editId || null);
  const ticketId = useRef(null);
  useEffect(() => {
    if (!existing) return;
    setForm({ title: existing.title, category: existing.category, eventType: existing.eventType, description: existing.description, tags: '', date: existing.date, venue: existing.venue, price: String(existing.price), capacity: String(existing.capacity), image: existing.image_url || existing.image || '' });
    ticketId.current = existing.ticket_types[0]?.id || null;
  }, [existing]);
  const submit = async publish => {
    if (saved) return;
    setSaved(true);
    try {
      const body = { title: form.title, category: form.category, description: form.description, venue: form.venue, city: existing?.city || form.venue, address: existing?.address || form.venue, capacity: Number(form.capacity), image_url: form.image.trim(), start_datetime: existing?.date === form.date ? existing.start_datetime : `${form.date}T00:00:00+01:00`, end_datetime: existing?.date === form.date ? existing.end_datetime : `${form.date}T23:59:59+01:00` };
      const result = await api(createdId.current ? `/events/${createdId.current}/` : '/events/', { method: createdId.current ? 'PATCH' : 'POST', body });
      createdId.current = result.id;
      const ticket = await api(`/events/${result.id}/ticket-types/`, { method: ticketId.current ? 'PATCH' : 'POST', body: { ...(ticketId.current ? { id: ticketId.current } : {}), name: existing?.ticket_types[0]?.name || 'Regular', price: Number(form.price), quantity: Number(form.capacity) } });
      ticketId.current = ticket.id;
      if (publish) await api(`/events/${result.id}/submit/`, { method: 'POST' });
      toast.success(publish ? 'Event submitted for staff approval.' : 'Draft saved.');
      navigate(`/organizer/events/${result.id}/preview`);
    } catch (error) { toast.error(error.message); setSaved(false); }
  };

  return (
    <div className="pt-24">
      <OrganizerShell
        breadcrumb={["Home", "Organizer", existing ? "Edit Event" : "Create Event"]}
        title={existing ? "Edit Event" : "Create New Event"}
        subtitle={existing ? "Update your event details and keep your audience informed." : "Fill in the details below to create your event."}
        actions={
          <button
            onClick={() => navigate("/organizer/events")}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
            data-testid="button-cancel-event"
          >
            <ArrowLeft className="w-4 h-4" /> Back to events
          </button>
        }
      >
        <Stepper current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {step === 1 && (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className={labelClass} htmlFor="event-title">Event Title *</label>
                  <input id="event-title" maxLength={100} className={inputClass} value={form.title} onChange={e => update("title", e.target.value)} placeholder="Enter a catchy event title" data-testid="input-event-title" />
                  <p className="text-xs text-gray-400 mt-1.5 text-right font-medium">{form.title.length}/100</p>
                </div>
                <div>
                  <label className={labelClass} htmlFor="event-category">Category *</label>
                  <select id="event-category" className={inputClass} value={form.category} onChange={e => update("category", e.target.value)} data-testid="select-form-category">
                    <option>Music</option><option>Business</option><option>Food</option><option>Technology</option><option>Faith</option><option>Sports</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Event Type *</label>
                  <div className="flex gap-4">
                    {["Online", "Physical Event"].map(type => (
                      <label key={type} className={`flex-1 flex items-center gap-3 border rounded-xl px-5 py-3 text-sm font-bold cursor-pointer transition-colors ${form.eventType === type ? "border-[#3F7D3D] text-black bg-[#EAF5EA]/30" : "border-gray-200 text-gray-500"}`}>
                        <input type="radio" name="eventType" className="accent-[#3F7D3D]" checked={form.eventType === type} onChange={() => type === "Online" ? toast("Online events are not available yet.") : update("eventType", type)} />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass} htmlFor="event-description">Short Description *</label>
                  <textarea id="event-description" rows={4} maxLength={200} className={inputClass} value={form.description} onChange={e => update("description", e.target.value)} placeholder="Write a short summary about your event!" data-testid="textarea-event-description" />
                  <p className="text-xs text-gray-400 mt-1.5 text-right font-medium">{form.description.length}/200</p>
                </div>
                <div>
                  <label className={labelClass} htmlFor="event-tags">Tags (Optional)</label>
                  <input id="event-tags" readOnly title="Event tags are not supported yet." className={inputClass} value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="Add tags to help people discover your event" data-testid="input-event-tags" />
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">Separate tags with commas.</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="event-venue">Venue *</label>
                  <input id="event-venue" className={inputClass} value={form.venue} onChange={e => update("venue", e.target.value)} placeholder="Venue name and city" data-testid="input-event-venue" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="event-date">Event Date (all-day) *</label>
                  <input id="event-date" type="date" className={inputClass} value={form.date} onChange={e => update("date", e.target.value)} data-testid="input-event-date" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass} htmlFor="event-price">Ticket Price (&#8358;) *</label>
                  <input id="event-price" type="number" min="0" className={inputClass} value={form.price} onChange={e => update("price", e.target.value)} data-testid="input-ticket-price" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="event-capacity">Ticket Capacity *</label>
                  <input id="event-capacity" type="number" min="1" className={inputClass} value={form.capacity} onChange={e => update("capacity", e.target.value)} data-testid="input-ticket-capacity" />
                </div>
                <p className="md:col-span-2 text-xs text-gray-500 font-medium">You can add more ticket types (VIP, VVIP, Early Bird) from Ticket Management before submitting for approval.</p>
              </div>
            )}

            {step === 4 && (
              <div>
                <label className={labelClass}>Event Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gray-50/50">
                  {form.image ? (
                    <img src={form.image} alt="" className="h-48 mx-auto rounded-xl object-cover mb-4 shadow-sm" />
                  ) : (
                    <ImagePlus className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  )}
                  <input
                    className={`${inputClass} max-w-md mx-auto`}
                    placeholder="/your-event-image.jpg or https://..."
                    value={form.image}
                    onChange={e => update("image", e.target.value)}
                    data-testid="input-event-image"
                  />
                   <p className="text-xs text-gray-400 mt-2 font-medium">
                     Use a file URL from public (for example /event.jpg) or paste a full image URL.
                   </p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="font-bold text-xl text-black mb-6">Preview &amp; Publish</h2>
                <div className="h-56 bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-inner">
                  {form.image && <img src={form.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <h3 className="font-extrabold text-black text-xl">{form.title || "Untitled event"}</h3>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{form.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100 text-sm">
                  <div><p className="text-xs text-gray-400 font-bold mb-1">Category</p><p className="font-bold text-black">{form.category}</p></div>
                  <div><p className="text-xs text-gray-400 font-bold mb-1">Venue</p><p className="font-bold text-black">{form.venue || "—"}</p></div>
                  <div><p className="text-xs text-gray-400 font-bold mb-1">Ticket Price</p><p className="font-bold text-black">{naira(Number(form.price) || 0)}</p></div>
                  <div><p className="text-xs text-gray-400 font-bold mb-1">Capacity</p><p className="font-bold text-black">{form.capacity}</p></div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => (step === 1 ? navigate("/organizer/events") : setStep(s => s - 1))}
                className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                data-testid="button-form-cancel"
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>
              {step < STEPS.length ? (
                <button
                  disabled={!canAdvance()}
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#3F7D3D] hover:bg-[#336633] disabled:opacity-50 shadow-sm transition-colors"
                  data-testid="button-save-continue"
                >
                  Save &amp; Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    disabled={saved}
                    onClick={() => submit(false)}
                    className="px-6 py-3 rounded-xl text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    data-testid="button-save-event"
                  >
                    {saved ? "Saved" : "Save as draft"}
                  </button>
                  <button
                    disabled={saved}
                    onClick={() => submit(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#F36B25] hover:bg-[#d95d1d] shadow-sm transition-colors"
                    data-testid="button-publish-event"
                  >
                    {saved ? "Publishing..." : "Submit for Approval"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="bg-[#EAF5EA] rounded-2xl border border-[#c4e5c4] p-8 h-fit">
            <ShieldCheck className="w-6 h-6 text-[#3F7D3D] mb-3" />
            <h3 className="font-bold text-base text-black mb-2">Tips</h3>
            <p className="text-xs text-gray-600 leading-6">A clear title and description helps people understand your event better and increases ticket sales.</p>
            <h3 className="font-bold text-base text-black mt-6 mb-2">Need help?</h3>
            <p className="text-xs text-gray-600 leading-6">Watch our quick guide on how to create and publish your event.</p>
            <button className="mt-4 text-sm font-bold text-[#3F7D3D] hover:underline" data-testid="button-watch-guide">Watch Guide &rarr;</button>
          </aside>
        </div>
      </OrganizerShell>
    </div>
  );
}