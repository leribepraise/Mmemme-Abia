import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { Pill } from "./DetailParts";

const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const UserProfileHeader = ({ user, onToggleSuspend }) => {
  const isSuspended = user.status === "Suspended";
  const soon = (what) => () => toast(`${what} isn't built yet`);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="relative shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0f3d1b] text-base font-semibold text-white">
              {initials(user.name)}
            </span>
          )}
          <button
            type="button"
            onClick={soon("Photo upload")}
            aria-label="Change photo"
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm"
          >
            <Camera size={11} />
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
            <Pill>{user.status}</Pill>
          </div>
          <p className="text-xs text-gray-500">{user.role}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#1a6a2a]" />
              {user.lga}, Abia State
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-[#1a6a2a]" />
              {user.phone}
            </span>
            <span className="flex items-center gap-1.5 break-all">
              <Mail size={13} className="text-[#1a6a2a]" />
              {user.email}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={soon("Messaging")}
          className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Mail size={14} />
          Send Message
        </button>
        <button
          type="button"
          onClick={onToggleSuspend}
          className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium ${
            isSuspended
              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              : "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          {isSuspended ? (
            <CheckCircle2 size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
          {isSuspended ? "Reactivate User" : "Suspend User"}
        </button>
        <button
          type="button"
          onClick={soon("More actions")}
          aria-label="More actions"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserProfileHeader;
