import React, { useState } from "react";
import { Monitor } from "lucide-react";
import { useApi } from '@/hooks/useApi';

const LoginActivityCard = () => {
  const [open, setOpen] = useState(false);
  const activity = useApi(open ? '/auth/login-activity/' : null);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <Monitor className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">Login Activity</h3>
          <p className="text-sm text-gray-500">
            Review recent sign-in times and devices.
          </p>
        </div>
      </div>

      <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} className="text-[#3F783D] text-sm font-semibold hover:underline shrink-0">
        {open ? 'Hide Details' : 'View Details'}
      </button>
      </div>
      {open && <div className="mt-5 border-t border-gray-200 pt-4" role="region" aria-label="Recent sign-ins">
        {activity.loading ? <p className="text-sm text-gray-500">Loading sign-ins…</p> : activity.error ? <p role="alert" className="text-sm text-red-600">{activity.error.message}</p> : !activity.data?.length ? <p className="text-sm text-gray-500">No recent sign-ins are recorded yet.</p> : <ul className="space-y-3">{activity.data.map((row, index) => <li key={`${row.at}-${index}`} className="rounded-lg bg-gray-50 px-4 py-3 text-sm"><strong className="block text-gray-800">{new Date(row.at).toLocaleString()}</strong><span className="mt-1 block break-words text-gray-500">{row.device}</span></li>)}</ul>}
      </div>}
    </div>
  );
};

export default LoginActivityCard;
