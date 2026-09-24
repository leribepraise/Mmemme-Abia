import React, { useState, useRef } from "react";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

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
    try {
      const canvas = await captureTicket();
      const link = document.createElement("a");
      link.download = `ticket-${bookingRef}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Ticket downloaded!");
    } catch (err) {
      console.error("Image download failed:", err);
      toast.error("Something went wrong generating the ticket.");
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
      pdf.save(`ticket-${bookingRef}.pdf`);
      toast.success("Ticket downloaded!");
    } catch (err) {
      console.error("PDF download failed:", err);
      toast.error("Something went wrong generating the ticket.");
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

      {/* Main Action Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-[#F97316] px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#ea580c] md:text-base"
      >
        <Download className="h-5 w-5" />
        <span>Download Ticket</span>
      </button>

      {/* Options Dropdown */}
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-1.5 shadow-xl">
          <button
            onClick={downloadAsPDF}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-100 md:text-base"
          >
            <FileText className="h-5 w-5 text-[#265F27]" />
            <span>Download as PDF</span>
          </button>

          <button
            onClick={downloadAsImage}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-100 md:text-base"
          >
            <ImageIcon className="h-5 w-5 text-[#F97316]" />
            <span>Download as Image</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadTicketButton;
