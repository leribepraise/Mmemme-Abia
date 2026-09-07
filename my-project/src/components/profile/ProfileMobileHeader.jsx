import React from "react";
import { Menu, X } from "lucide-react";

const ProfileMobileHeader = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <div className="flex items-center justify-between border-b bg-white px-5 py-4 lg:hidden">
      <h1 className="text-lg font-bold text-[#1B5E20]">Mmemme Abia</h1>

      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="rounded-lg p-2 transition hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  );
};

export default ProfileMobileHeader;
