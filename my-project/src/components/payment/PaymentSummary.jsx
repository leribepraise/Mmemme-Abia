const PaymentSummary = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-black mb-6">Payment Summary</h2>

      <div className="flex gap-4 mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
          <img
            src="/checkout.jpg"
            alt="Event"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h3 className="font-bold text-sm text-black mb-2 leading-tight">
            Abia Business Summit 2026
          </h3>

          <p className="text-[10px] text-gray-500 mb-1">
            Fri, 25 - Sun, 27 Oct, 2026
          </p>

          <p className="text-[10px] text-gray-500 leading-tight">
            Umueze Sports Arena, Umuahia, Abia
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-black text-sm mb-4">Tickets</h3>

        <div className="space-y-3 text-sm font-semibold text-gray-600">
          <div className="flex justify-between">
            <span>Regular (x2)</span>
            <span className="text-black">N6,000</span>
          </div>

          <div className="flex justify-between">
            <span>VIP (x1)</span>
            <span className="text-black">N10,000</span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 mb-6"></div>

      <div className="space-y-3 mb-6 text-sm font-semibold text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-black">N16,000</span>
        </div>

        <div className="flex justify-between">
          <span>Service Fee</span>
          <span className="text-black">N1,250</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <span className="font-bold text-black text-lg">Total</span>

        <span className="font-bold text-[#48782E] text-xl">N17,250</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
