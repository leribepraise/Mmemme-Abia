import { useCollection } from "@/hooks/useApi";
import { money } from "@/lib/api";
import React from "react";

import SectionHeader from "./common/SectionHeader";

const PaymentHistory = () => {
  const { data: payments } = useCollection("/payments/");
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
            {payments.map(payment => <tr key={payment.id} className="border-b">
              <td className="px-5 py-4">{payment.reference}</td>
              <td className="px-5 py-4 text-gray-500">{payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : '—'}</td>
              <td className="px-5 py-4 text-green-600">{payment.status}</td>
              <td className="px-5 py-4 font-semibold">{money(payment.amount)}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
