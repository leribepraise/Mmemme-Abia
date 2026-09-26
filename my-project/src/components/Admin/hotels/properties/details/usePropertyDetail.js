import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPropertyDetail } from "@/data/adminPropertyDetail";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const load = (id) => {
  const detail = getPropertyDetail(id);
  if (!detail) return null;
  return applyStatusOverrides("properties", [detail])[0];
};

// TODO: replace the internals with real API calls once the backend is connected.
const usePropertyDetail = (id) => {
  const [property, setProperty] = useState(() => load(id));

  useEffect(() => {
    setProperty(load(id));
  }, [id]);

  const changeStatus = (nextStatus, message) => {
    if (!property) return;
    setStatusOverride("properties", property.id, {
      status: nextStatus,
      before: null,
    });
    setProperty((prev) => ({
      ...prev,
      status: nextStatus,
      statusBeforeSuspend: null,
    }));
    toast.success(message);
  };

  const approve = () => {
    if (property) changeStatus("Approved", `${property.name} approved`);
  };
  const reject = () => {
    if (property) changeStatus("Rejected", `${property.name} rejected`);
  };
  const reopen = () => {
    if (property)
      changeStatus("Pending", `${property.name} reopened for review`);
  };

  return { property, notFound: !property, approve, reject, reopen };
};

export default usePropertyDetail;
