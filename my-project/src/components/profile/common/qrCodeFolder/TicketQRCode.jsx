import React from "react";
import { QRCodeSVG } from "qrcode.react";

const TicketQRCode = ({ value, size = 55 }) => {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#172033"
      level="M"
    />
  );
};

export default TicketQRCode;
