const PaymentSummary = ({ event, tickets, subtotal, serviceFee, total }) => {
  const formatCurrency = (amount = 0) => `N${amount.toLocaleString()}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-black mb-6">Payment Summary</h2>

      <div className="flex gap-4 mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
          <img
            src={event?.image || "/checkout.jpg"}
            alt={event?.text || "Event"}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h3 className="font-bold text-sm text-black mb-2 leading-tight">
            {event?.text || "Event"}
          </h3>

          <p className="text-[10px] text-gray-500 mb-1">
            Event date coming soon
          </p>

          <p className="text-[10px] text-gray-500 leading-tight">
            {event?.text2 || "Location unavailable"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-black text-sm mb-4">Tickets</h3>

        <div className="space-y-3 text-sm font-semibold text-gray-600">
          {tickets
            ?.filter((ticket) => ticket.qty > 0)
            .map((ticket) => (
              <div key={ticket.id} className="flex justify-between">
                <span>
                  {ticket.name} (x{ticket.qty})
                </span>

                <span className="text-black">
                  {formatCurrency(ticket.basePrice * ticket.qty)}
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 mb-6"></div>

      <div className="space-y-3 mb-6 text-sm font-semibold text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <span className="text-black">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span>Service Fee</span>

          <span className="text-black">{formatCurrency(serviceFee)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <span className="font-bold text-black text-lg">Total</span>

        <span className="font-bold text-[#48782E] text-xl">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
};

export default PaymentSummary;
