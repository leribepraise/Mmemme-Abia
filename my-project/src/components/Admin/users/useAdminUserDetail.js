import { useMemo, useState } from "react";
import { getUserDetail } from "@/data/adminUserDetail";
import { getStatusOverride, setStatusOverride } from "@/data/adminStatusStore";

// TODO: replace the internals with GET /admin/users/:id/ once the backend is connected.
// Components only use what this hook returns.
const useAdminUserDetail = (id) => {
  const detail = useMemo(() => getUserDetail(id), [id]);
  const [, setTick] = useState(0); // re-render after a status change

  if (!detail) {
    return {
      user: null,
      notFound: true,
      bookings: [],
      payments: [],
      activities: [],
      toggleSuspend: () => {},
    };
  }

  const { bookings, payments, activities, ...base } = detail;
  const override = getStatusOverride("users", id);
  const status = override ? override.status : base.status;
  const user = { ...base, status };

  const toggleSuspend = () => {
    if (status === "Suspended") {
      setStatusOverride("users", id, {
        status: override?.before || "Active",
        before: null,
      });
    } else {
      setStatusOverride("users", id, { status: "Suspended", before: status });
    }
    setTick((t) => t + 1);
  };

  return {
    user,
    notFound: false,
    bookings,
    payments,
    activities,
    toggleSuspend,
  };
};

export default useAdminUserDetail;
