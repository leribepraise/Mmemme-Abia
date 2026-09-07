import React from "react";

import SectionHeader from "./common/SectionHeader";

const PaymentHistory = () => {
  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="Payment History"
        description="View your previous transactions."
      />

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-5 py-4">Transaction</th>

              <th className="px-5 py-4">Date</th>

              <th className="px-5 py-4">Status</th>

              <th className="px-5 py-4">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b">
              <td className="px-5 py-4">Hotel Oris Live Concert</td>

              <td className="px-5 py-4 text-gray-500">Oct 25, 2026</td>

              <td className="px-5 py-4 text-green-600">Successful</td>

              <td className="px-5 py-4 font-semibold">₦2,500</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
