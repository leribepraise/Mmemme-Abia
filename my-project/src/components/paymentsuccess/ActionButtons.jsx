// import React, { useRef, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { FileText, Image as ImageIcon } from "lucide-react";
// import html2canvas from "html2canvas-pro";
// import jsPDF from "jspdf";
// import EventTicketPreview from "../paymentsuccess/downlaodTicketFolder/EventTicketPreview";

// const ActionButtons = ({ event, tickets, total, orderId }) => {
//   const [open, setOpen] = useState(false);
//   const ticketRef = useRef(null);

//   const captureTicket = async () => {
//     return await html2canvas(ticketRef.current, {
//       scale: 2,
//       backgroundColor: "#ffffff",
//     });
//   };

//   const downloadAsImage = async () => {
//     try {
//       const canvas = await captureTicket();
//       const link = document.createElement("a");
//       link.download = `ticket-${orderId}.png`;
//       link.href = canvas.toDataURL("image/png");
//       link.click();
//     } catch (err) {
//       console.error("Download failed:", err);
//       alert("Something went wrong generating the ticket.");
//     } finally {
//       setOpen(false);
//     }
//   };

//   const downloadAsPDF = async () => {
//     try {
//       const canvas = await captureTicket();
//       const imgData = canvas.toDataURL("image/png");

//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "px",
//         format: [canvas.width, canvas.height],
//         hotfixes: ["px_scaling"],
//       });

//       pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
//       pdf.save(`ticket-${orderId}.pdf`);
//     } catch (err) {
//       console.error("Download failed:", err);
//       alert("Something went wrong generating the ticket.");
//     } finally {
//       setOpen(false);
//     }
//   };

//   return (
//     <>
//       {/* Hidden off-screen ticket used only for capture */}
//       <div className="fixed top-0 left-0 opacity-0 pointer-events-none -z-10">
//         <EventTicketPreview
//           ref={ticketRef}
//           event={event}
//           tickets={tickets}
//           total={total}
//           orderId={orderId}
//         />
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
//         <NavLink to="/ticket">
//           <button className="bg-[#48782E] hover:bg-[#3a6125] text-white font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm w-full sm:w-auto">
//             View My Ticket
//           </button>
//         </NavLink>

//         <div className="relative w-full sm:w-auto">
//           <button
//             onClick={() => setOpen((prev) => !prev)}
//             className="bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm w-full sm:w-auto"
//           >
//             Download Ticket
//           </button>

//           {open && (
//             <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 left-0">
//               <button
//                 onClick={downloadAsPDF}
//                 className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
//               >
//                 <FileText className="w-4 h-4" />
//                 Download as PDF
//               </button>

//               <button
//                 onClick={downloadAsImage}
//                 className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition border-t border-gray-100"
//               >
//                 <ImageIcon className="w-4 h-4" />
//                 Download as Image
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <button className="mt-8 text-[#48782E] font-bold text-sm hover:underline">
//         Back to Home
//       </button>
//     </>
//   );
// };

// export default ActionButtons;

import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FileText, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import EventTicketPreview from "../paymentsuccess/downlaodTicketFolder/EventTicketPreview";

const ActionButtons = ({ event, tickets, attendee, total, orderId }) => {
  const [open, setOpen] = useState(false);
  const ticketRef = useRef(null);

  const captureTicket = async () => {
    return await html2canvas(ticketRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
  };

  const downloadAsImage = async () => {
    try {
      const canvas = await captureTicket();
      const link = document.createElement("a");
      link.download = `ticket-${orderId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Something went wrong generating the ticket.");
    } finally {
      setOpen(false);
    }
  };

  const downloadAsPDF = async () => {
    try {
      const canvas = await captureTicket();
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
        hotfixes: ["px_scaling"],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`ticket-${orderId}.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Something went wrong generating the ticket.");
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Hidden off-screen ticket used only for capture */}
      <div className="fixed top-0 left-0 opacity-0 pointer-events-none -z-10">
        <EventTicketPreview
          ref={ticketRef}
          event={event}
          tickets={tickets}
          attendee={attendee}
          total={total}
          orderId={orderId}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
        <NavLink to="/ticket">
          <button className="bg-[#48782E] hover:bg-[#3a6125] text-white font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm w-full sm:w-auto">
            View My Ticket
          </button>
        </NavLink>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm w-full sm:w-auto"
          >
            Download Ticket
          </button>

          {open && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 left-0">
              <button
                onClick={downloadAsPDF}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <FileText className="w-4 h-4" />
                Download as PDF
              </button>

              <button
                onClick={downloadAsImage}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition border-t border-gray-100"
              >
                <ImageIcon className="w-4 h-4" />
                Download as Image
              </button>
            </div>
          )}
        </div>
      </div>

      <button className="mt-8 text-[#48782E] font-bold text-sm hover:underline">
        Back to Home
      </button>
    </>
  );
};

export default ActionButtons;
