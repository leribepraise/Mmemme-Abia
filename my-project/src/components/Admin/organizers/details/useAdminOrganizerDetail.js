import { useEffect, useState } from "react";
import { getOrganizerDetail } from "@/data/adminOrganizerDetail";
import { getStatusOverride, setStatusOverride } from "@/data/adminStatusStore";

// TODO: replace the internals with GET /admin/organizers/:id/ once the backend is connected.
// Components only use what this hook returns.
const build = (id) => {
  const detail = getOrganizerDetail(id);
  if (!detail) return null;

  const { stats, activities, gallery, ...organizer } = detail;

  // Lay any saved status change (from this page or the list) over the generated profile
  const override = getStatusOverride("organizers", id);

  return {
    organizer: {
      ...organizer,
      status: override ? override.status : organizer.status,
      statusBeforeSuspend: override ? override.before : null,
      rejectionNote: override?.note ?? "",
    },
    stats,
    activities,
    gallery,
  };
};

const useAdminOrganizerDetail = (id) => {
  const [detail, setDetail] = useState(() => build(id));

  // Reload when the :id in the URL changes
  useEffect(() => {
    setDetail(build(id));
  }, [id]);

  const updateOrganizer = (changes) =>
    setDetail((prev) =>
      prev ? { ...prev, organizer: { ...prev.organizer, ...changes } } : prev,
    );

  const verify = () => {
    setStatusOverride("organizers", id, { status: "Verified", before: null });
    updateOrganizer({
      status: "Verified",
      statusBeforeSuspend: null,
      rejectionNote: "",
    });
  };

  const reject = (note = "") => {
    setStatusOverride("organizers", id, {
      status: "Rejected",
      before: null,
      note,
    });
    updateOrganizer({
      status: "Rejected",
      statusBeforeSuspend: null,
      rejectionNote: note,
    });
  };

  // Puts a rejected organizer back into the approval queue
  const reopen = () => {
    setStatusOverride("organizers", id, { status: "Pending", before: null });
    updateOrganizer({
      status: "Pending",
      statusBeforeSuspend: null,
      rejectionNote: "",
    });
  };

  // Reactivating restores whatever the status was before suspension
  const toggleSuspend = () => {
    const current = detail?.organizer;
    if (!current) return;

    const isSuspended = current.status === "Suspended";
    const nextStatus = isSuspended
      ? current.statusBeforeSuspend || "Verified"
      : "Suspended";
    const before = isSuspended ? null : current.status;

    setStatusOverride("organizers", id, { status: nextStatus, before });
    updateOrganizer({ status: nextStatus, statusBeforeSuspend: before });
  };

  return {
    notFound: !detail,
    organizer: detail?.organizer ?? null,
    stats: detail?.stats ?? [],
    activities: detail?.activities ?? [],
    gallery: detail?.gallery ?? { cover: null, thumbs: [] },
    verify,
    reject,
    reopen,
    toggleSuspend,
  };
};

export default useAdminOrganizerDetail;
