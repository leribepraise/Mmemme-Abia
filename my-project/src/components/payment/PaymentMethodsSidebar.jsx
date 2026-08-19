import { CreditCard, Landmark, Hash, Smartphone, Wallet } from "lucide-react";
import PaymentMethod from "./PaymentMethod";

const PaymentMethodsSidebar = ({ activeMethod, setActiveMethod }) => {
  return (
    <div className="lg:col-span-3 space-y-3">
      <h2 className="font-bold text-lg text-black mb-4">Payment Methods</h2>

      <PaymentMethod
        id="card"
        icon={CreditCard}
        title="Card Payment"
        subtitle="Visa, Mastercard, Verve"
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
      />

      <PaymentMethod
        id="bank"
        icon={Landmark}
        title="Bank Transfer"
        subtitle="Pay directly from your bank"
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
      />

      <PaymentMethod
        id="ussd"
        icon={Hash}
        title="USSD"
        subtitle="*330* and other codes"
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
      />

      <PaymentMethod
        id="mobile"
        icon={Smartphone}
        title="Mobile Money"
        subtitle="MTN, Airtel, Glo"
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
      />

      <PaymentMethod
        id="paystack"
        icon={Wallet}
        title="Pay with Paystack"
        subtitle="Fast and secure"
        activeMethod={activeMethod}
        setActiveMethod={setActiveMethod}
      />
    </div>
  );
};

export default PaymentMethodsSidebar;
