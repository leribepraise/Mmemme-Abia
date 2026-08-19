import { Plus, Minus } from "lucide-react";
import SectionHeader from "./SectionHeader";

const TicketSelectionCard = ({ tickets, updateQty, formatCurrency }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <SectionHeader number="2" title="Ticket Selection" />

      <div className="grid grid-cols-12 text-[18px] font-semibold text-[#3D3E3E] mb-4 border-b border-gray-100 pb-2">
        <div className="col-span-4">Ticket Type</div>
        <div className="col-span-4 text-center">Quantity</div>
        <div className="col-span-4 text-right pr-12">Price</div>
      </div>

      <div className="space-y-6 mb-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="grid grid-cols-12 items-center border-b border-gray-50 pb-6 last:border-0 last:pb-0"
          >
            <div className="col-span-4">
              <p className="font-bold text-black text-[18px]">{ticket.name}</p>
              <p className="text-sm font-semibold mt-1">
                {formatCurrency(ticket.basePrice)}
              </p>
            </div>

            <div className="col-span-4 flex justify-center">
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => updateQty(ticket.id, -1)}
                  className="px-3 py-1 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="px-4 py-1 font-bold text-black border-x border-gray-200 min-w-[2.5rem] text-center">
                  {ticket.qty}
                </div>

                <button
                  onClick={() => updateQty(ticket.id, 1)}
                  className="px-3 py-1 hover:bg-gray-50 text-[#48782E] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="col-span-4 flex items-center justify-between pl-4">
              <span className="font-bold text-black">
                {ticket.qty > 0
                  ? formatCurrency(ticket.basePrice * ticket.qty)
                  : "N0"}
              </span>

              <button className="text-xs font-bold text-[#48782E] hover:underline">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="flex items-center gap-2 text-[#48782E] font-bold text-sm px-4 py-2 border border-[#48782E] rounded-lg hover:bg-green-50 transition-colors">
        <Plus className="w-4 h-4" />
        Add another ticket
      </button>
    </div>
  );
};

export default TicketSelectionCard;
