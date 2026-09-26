import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDestinationDetail } from "@/data/destinationDetail";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const load = (id) => {
  const detail = getDestinationDetail(id);
  if (!detail) return null;
  return applyStatusOverrides("tourism", [detail])[0];
};

// TODO: replace the internals with real API calls (get, approve, reject)
// once the Django backend is connected. Components only use what this hook returns.
const useDestinationDetail = (id) => {
  const [destination, setDestination] = useState(() => load(id));

  useEffect(() => {
    setDestination(load(id));
  }, [id]);

  const changeStatus = (nextStatus, message) => {
    if (!destination) return;
    setStatusOverride("tourism", destination.id, {
      status: nextStatus,
      before: null,
    });
    setDestination((prev) => ({
      ...prev,
      status: nextStatus,
      statusBeforeSuspend: null,
    }));
    toast.success(message);
  };

  const approve = () => {
    if (destination) changeStatus("Approved", `${destination.name} approved`);
  };

  const reject = () => {
    if (destination) changeStatus("Rejected", `${destination.name} rejected`);
  };

  const reopen = () => {
    if (destination)
      changeStatus("Pending", `${destination.name} reopened for review`);
  };

  return { destination, notFound: !destination, approve, reject, reopen };
};

export default useDestinationDetail;
