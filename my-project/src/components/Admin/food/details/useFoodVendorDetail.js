import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getFoodVendorDetail } from "@/data/adminFoodDetail";
import {
  applyStatusOverrides,
  setStatusOverride,
} from "@/data/adminStatusStore";

const load = (id) => {
  const detail = getFoodVendorDetail(id);
  if (!detail) return null;
  return applyStatusOverrides("food", [detail])[0];
};

// TODO: replace the internals with real API calls once the backend is connected.
const useFoodVendorDetail = (id) => {
  const [vendor, setVendor] = useState(() => load(id));

  useEffect(() => {
    setVendor(load(id));
  }, [id]);

  const changeStatus = (nextStatus, message) => {
    if (!vendor) return;
    setStatusOverride("food", vendor.id, { status: nextStatus, before: null });
    setVendor((prev) => ({
      ...prev,
      status: nextStatus,
      statusBeforeSuspend: null,
    }));
    toast.success(message);
  };

  const approve = () => {
    if (vendor) changeStatus("Approved", `${vendor.name} approved`);
  };
  const reject = () => {
    if (vendor) changeStatus("Rejected", `${vendor.name} rejected`);
  };
  const reopen = () => {
    if (vendor) changeStatus("Pending", `${vendor.name} reopened for review`);
  };

  return { vendor, notFound: !vendor, approve, reject, reopen };
};

export default useFoodVendorDetail;
