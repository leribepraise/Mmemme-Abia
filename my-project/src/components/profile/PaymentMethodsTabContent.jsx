import React from "react";
import SavedCardsCard from "./SavedCardsCard";
import MobileMoneyCard from "./MobileMoneyCard";
import BankTransferCard from "./BankTransferCard";
import OtherPaymentMethodsCard from "./OtherPaymentMethodsCard";

const PaymentMethodsTabContent = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-bold text-lg text-[#172033]">Payment Methods</h2>
        <p className="text-sm text-gray-500">
          Manage your payment methods for faster and easier bookings.
        </p>
      </div>

      <div className="space-y-4">
        <SavedCardsCard />
        <MobileMoneyCard />
        <BankTransferCard />
        <OtherPaymentMethodsCard />
      </div>
    </div>
  );
};

export default PaymentMethodsTabContent;
