import React, { useState } from "react";
import { UserRound, Pencil } from "lucide-react";

const AccountRecoveryCard = ({ user }) => {
  const [form, setForm] = useState({
    recoveryEmail: user?.email || "",
    recoveryPhone: user?.phone || "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <UserRound className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Account Recovery
          </h3>
          <p className="text-sm text-gray-500">
            Add a recovery email or phone number in case you ever lose access to
            your account.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Recovery Email
          </label>
          <div className="relative">
            <input
              value={form.recoveryEmail}
              onChange={handleChange("recoveryEmail")}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-700"
            />
            <Pencil className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Recovery Phone Number
          </label>
          <div className="relative">
            <input
              value={form.recoveryPhone}
              onChange={handleChange("recoveryPhone")}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-700"
            />
            <Pencil className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountRecoveryCard;
