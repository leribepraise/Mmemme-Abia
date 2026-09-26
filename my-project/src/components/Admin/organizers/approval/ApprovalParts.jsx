export const ApprovalCard = ({ title, children, className = "" }) => (
  <section className={`rounded-xl bg-white p-5 shadow-sm ${className}`}>
    {title && (
      <h2 className="border-b border-slate-100 pb-3 text-base font-semibold text-slate-900">
        {title}
      </h2>
    )}
    <div className={title ? "pt-4" : ""}>{children}</div>
  </section>
);

export const ApprovalStatusChip = ({ status }) => {
  if (status === "Rejected") {
    return (
      <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-[#f28c28]">
      Pending Verification
    </span>
  );
};
