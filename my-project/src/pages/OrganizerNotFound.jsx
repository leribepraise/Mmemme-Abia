import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

export default function OrganizerNotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-extrabold text-black mb-2">Page not found</h1>
        <p className="text-sm text-gray-500 mb-6">This organizer page doesn't exist, or it may have moved.</p>
        <button
          onClick={() => navigate("/organizer/dashboard")}
          className="inline-flex items-center gap-2 bg-[#3F7D3D] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#336633] transition-colors"
          data-testid="button-organizer-404-home"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to dashboard
        </button>
      </div>
    </div>
  );
}
