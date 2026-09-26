const roleStyles = {
  User: "text-slate-700",
  Organizer: "text-orange-600",
  Vendor: "text-orange-600",
  Driver: "text-orange-600",
  Host: "text-blue-600",
};

const statusStyles = {
  Active: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-600",
  Suspended: "bg-red-50 text-red-500",
};

const avatarTints = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Shows the user's photo if they have one (`user.avatar`), otherwise their initials
export const UserAvatar = ({ user }) => {
  if (user.avatar) {
    return <img src={user.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        avatarTints[user.id % avatarTints.length]
      }`}
      aria-hidden="true"
    >
      {getInitials(user.name)}
    </span>
  );
};

export const RoleLabel = ({ role }) => {
  return <span className={`text-xs font-medium ${roleStyles[role] ?? "text-slate-700"}`}>{role}</span>;
};

export const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
        statusStyles[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
};