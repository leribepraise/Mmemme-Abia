import React, { useState, useRef } from "react";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
// import html2canvas from "html2canvas";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import TicketPreview from "./TicketPreview";

const DownloadTicketButton = ({ hotel, bookingRef }) => {
  const [open, setOpen] = useState(false);
  const ticketRef = useRef(null);

  const captureTicket = async () => {
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    return canvas;
  };

  const downloadAsImage = async () => {
    const canvas = await captureTicket();
    const link = document.createElement("a");
    link.download = `ticket-${bookingRef}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setOpen(false);
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
      pdf.save(`ticket-${bookingRef}.pdf`);
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Something went wrong generating the ticket.");
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Hidden off-screen ticket used only for capture */}
      <div className="absolute -left-[9999px] top-0">
        <TicketPreview ref={ticketRef} hotel={hotel} bookingRef={bookingRef} />
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-[#FC6C2B] hover:bg-[#e35f22] text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition"
      >
        <Download className="w-4 h-4" />
        Download Ticket
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
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
  );
};

export default DownloadTicketButton;
