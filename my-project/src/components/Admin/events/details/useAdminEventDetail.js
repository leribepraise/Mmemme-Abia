import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getEventDetail } from "../../../../data/adminEventDetail";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

// Builds the detail, then applies any status saved from the list page or here,
// so both pages always agree.
const load = (id) => {
  const detail = getEventDetail(id);
  if (!detail) return null;
  return applyStatusOverrides("events", [detail])[0];
};

// TODO: replace the internals with real API calls (get, approve, reject)
// once the Django backend is connected. Components only use what this hook returns.
const useAdminEventDetail = (id) => {
  const [event, setEvent] = useState(() => load(id));

  useEffect(() => {
    setEvent(load(id));
  }, [id]);

  const changeStatus = (nextStatus, message) => {
    if (!event) return;
    setStatusOverride("events", event.id, { status: nextStatus, before: null });
    setEvent((prev) => ({
      ...prev,
      status: nextStatus,
      statusBeforeSuspend: null,
    }));
    toast.success(message);
  };

  const approve = () => {
    if (event) changeStatus("Verified", `${event.title} approved`);
  };

  const reject = () => {
    if (event) changeStatus("Rejected", `${event.title} rejected`);
  };

  return { event, notFound: !event, approve, reject };
};

export default useAdminEventDetail;
