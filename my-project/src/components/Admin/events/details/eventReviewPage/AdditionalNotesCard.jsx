const MAX_NOTE = 500;

const AdditionalNotesCard = ({ note, onNoteChange }) => (
  <section className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
    <h2 className="text-sm font-semibold text-slate-900">Additional Notes</h2>
    <div className="relative mt-3">
      <textarea
        value={note}
        maxLength={MAX_NOTE}
        onChange={(e) => onNoteChange(e.target.value)}
        rows={4}
        placeholder="Any additional notes or feedback for the organizer..."
        className="w-full resize-none rounded-lg border border-slate-200 bg-white p-3 pb-6 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#0b6045]"
      />
      <span className="pointer-events-none absolute bottom-2 right-3 text-[11px] text-slate-400">
        {note.length}/{MAX_NOTE}
      </span>
    </div>
  </section>
);

export default AdditionalNotesCard;
