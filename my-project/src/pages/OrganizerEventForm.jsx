import { useCollection } from "@/hooks/useApi";
import { organizerEvent } from "@/lib/catalog";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ImagePlus, ShieldCheck } from "lucide-react";
import OrganizerShell from "@/components/organizer/OrganizerPublicShell";
import { naira } from "@/lib/utils";

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#3F7D3D] bg-white";
const labelClass = "block text-xs font-bold text-gray-700 mb-2";
const STEPS = ["Basic Info", "Date & Venue", "Tickets & Pricing", "Media", "Preview & Publish"];

function Stepper({ current }) {
  return (
    <div className="flex items-center mb-8 min-w-0 overflow-x-auto pb-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none min-w-[95px] sm:min-w-0">
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
    date: existing?.date || "",
    venue: existing?.venue || "",
    price: String(existing?.price || 5000),
    minimum_plan: 'bronze', membership_discount: false, membership_early_access: false, sales_start: '',
    capacity: String(existing?.ticketCapacity || 500),
    image: existing?.image || "",
  });
  const [saved, setSaved] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const imageObjectUrl = useRef(null);
  useEffect(() => () => { if (imageObjectUrl.current) URL.revokeObjectURL(imageObjectUrl.current); }, []);
  const selectImage = file => {
    if (imageObjectUrl.current) URL.revokeObjectURL(imageObjectUrl.current);
    imageObjectUrl.current = file ? URL.createObjectURL(file) : null;
    setImageFile(file);
    setImagePreview(imageObjectUrl.current || "");
  };
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
    const ticket = existing.ticket_types[0];
    setForm({ title: existing.title, category: existing.category, eventType: existing.eventType, description: existing.description, date: existing.date, venue: existing.venue, price: String(existing.price), capacity: String(existing.capacity), image: existing.image || '', minimum_plan: ticket?.minimum_plan || 'bronze', membership_discount: ticket?.membership_discount || false, membership_early_access: ticket?.membership_early_access || false, sales_start: ticket?.sales_start ? new Date(new Date(ticket.sales_start).getTime()-new Date(ticket.sales_start).getTimezoneOffset()*60000).toISOString().slice(0,16) : '' });
    ticketId.current = existing.ticket_types[0]?.id || null;
  }, [existing]);
  const submit = async publish => {
    if (saved) return;
    setSaved(true);
    try {
      const fields = { title: form.title, category: form.category, description: form.description, venue: form.venue, city: existing?.city || form.venue, address: existing?.address || form.venue, capacity: Number(form.capacity), start_datetime: existing?.date === form.date ? existing.start_datetime : `${form.date}T00:00:00+01:00`, end_datetime: existing?.date === form.date ? existing.end_datetime : `${form.date}T23:59:59+01:00` };
      const body = new FormData();
      Object.entries(fields).forEach(([key, value]) => body.append(key, value));
      if (imageFile) body.append("image", imageFile);
      const result = await api(createdId.current ? `/events/${createdId.current}/` : '/events/', { method: createdId.current ? 'PATCH' : 'POST', body });
      createdId.current = result.id;
      const ticket = await api(`/events/${result.id}/ticket-types/`, { method: ticketId.current ? 'PATCH' : 'POST', body: { ...(ticketId.current ? { id: ticketId.current } : {}), name: existing?.ticket_types[0]?.name || 'Regular', price: Number(form.price), quantity: Number(form.capacity), minimum_plan: form.minimum_plan, membership_discount: form.membership_discount, membership_early_access: form.membership_early_access, sales_start: form.sales_start ? new Date(form.sales_start).toISOString() : null } });
      ticketId.current = ticket.id;
      if (publish) await api(`/events/${result.id}/submit/`, { method: 'POST' });
      toast.success(publish ? 'Event submitted for staff approval.' : 'Draft saved.');
      navigate(`/organizer/events/${result.id}/preview`);
    } catch (error) { toast.error(error.message); setSaved(false); }
  };

  return (
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
        {existing?.review_note && <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm"><h2 className="font-semibold">Staff feedback</h2><p className="mt-2 whitespace-pre-wrap">{existing.review_note}</p></div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="min-w-0 lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-8">
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
                  <p className="rounded-xl border border-[#3F7D3D] bg-[#EAF5EA]/30 px-5 py-3 text-sm font-bold">Physical event</p>
                </div>
                <div>
                  <label className={labelClass} htmlFor="event-description">Short Description *</label>
                  <textarea id="event-description" rows={4} maxLength={200} className={inputClass} value={form.description} onChange={e => update("description", e.target.value)} placeholder="Write a short summary about your event!" data-testid="textarea-event-description" />
                  <p className="text-xs text-gray-400 mt-1.5 text-right font-medium">{form.description.length}/200</p>
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
                  <div className="mt-4 space-y-4"><label className={labelClass}>Ticket access<select value={form.minimum_plan} onChange={e=>update('minimum_plan',e.target.value)} className={inputClass}><option value="bronze">All members</option><option value="silver">Silver and Diamond members</option><option value="diamond">Diamond members only</option></select></label><label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={form.membership_discount} onChange={e=>update('membership_discount',e.target.checked)}/>Offer member discounts: Silver 15%, Diamond 30%. Discounts reduce your ticket revenue before commission.</label><label className={labelClass}>General sales open (optional)<input type="datetime-local" value={form.sales_start} onChange={e=>update('sales_start',e.target.value)} className={inputClass}/></label><label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={form.membership_early_access} onChange={e=>update('membership_early_access',e.target.checked)}/>Allow Silver to book 24 hours early and Diamond 48 hours early.</label></div>
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
                  {imagePreview || form.image ? (
                    <img src={imagePreview || form.image} alt="Event preview" className="h-48 max-w-full mx-auto rounded-xl object-cover mb-4 shadow-sm" />
                  ) : (
                    <ImagePlus className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  )}
                  <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Choose event image from gallery" className={`${inputClass} max-w-md mx-auto`} onChange={e => { const file=e.target.files?.[0]; if (file && file.size > 5*1024*1024) { toast.error('Images must be 5 MB or smaller.'); e.target.value=''; return; } selectImage(file || null); }} data-testid="input-event-image" />
                   <p className="text-xs text-gray-400 mt-2 font-medium">
                     Choose a JPEG, PNG, or WebP image from your gallery (up to 5 MB).
                   </p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="font-bold text-xl text-black mb-6">Preview &amp; Publish</h2>
                <div className="h-56 bg-gray-100 rounded-xl overflow-hidden mb-6 shadow-inner">
                  {(imagePreview || form.image) && <img src={imagePreview || form.image} alt="Event preview" className="w-full h-full object-cover" />}
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

            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
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
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
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
            <h3 className="font-bold text-base text-black mt-6 mb-2">Before publishing</h3>
            <p className="text-xs text-gray-600 leading-6">Add an image, check your ticket capacity, then preview the event before submitting it for review.</p>
          </aside>
        </div>
      </OrganizerShell>
  );
}
