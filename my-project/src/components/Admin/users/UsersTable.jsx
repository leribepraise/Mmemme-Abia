import UserRowActions from "./UserRowActions";
import { UserAvatar, RoleLabel, StatusBadge } from "./UserParts";

const UsersTable = ({ users, onToggleSuspend, onDelete, onClearFilters }) => {
  if (users.length === 0) {
    return (
      <div className="px-4 py-14 text-center">
        <p className="text-sm font-semibold text-slate-700">
          No users match your filters
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Try a different search or clear the filters.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Tablet and desktop: table */}
      <table className="hidden w-full text-left md:table">
        <thead>
          <tr className="border-b border-slate-100 text-xs text-slate-500">
            <th scope="col" className="px-5 py-3 font-medium">
              Name
            </th>
            <th scope="col" className="px-3 py-3 font-medium">
              Email / Phone
            </th>
            <th scope="col" className="px-3 py-3 font-medium">
              Role
            </th>
            <th scope="col" className="px-3 py-3 font-medium">
              L.G.A
            </th>
            <th scope="col" className="px-3 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-5 py-3 text-right font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="text-xs hover:bg-slate-50/60">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} />
                  <span className="font-semibold text-slate-800">
                    {user.name}
                  </span>
                </div>
              </td>
              <td className="px-3 py-3">
                <p className="text-slate-600">{user.email}</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {user.phone}
                </p>
              </td>
              <td className="px-3 py-3">
                <RoleLabel role={user.role} />
              </td>
              <td className="px-3 py-3 text-slate-600">{user.lga}</td>
              <td className="px-3 py-3">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-5 py-3 text-right">
                <UserRowActions
                  user={user}
                  onToggleSuspend={onToggleSuspend}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {users.map((user) => (
          <li key={user.id} className="flex items-start gap-3 p-4">
            <UserAvatar user={user} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user.name}
                </p>
                <StatusBadge status={user.status} />
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-600">
                {user.email}
              </p>
              <p className="text-[11px] text-slate-400">{user.phone}</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                <RoleLabel role={user.role} />
                <span aria-hidden="true">•</span>
                <span>{user.lga}</span>
              </p>
            </div>

            <UserRowActions
              user={user}
              onToggleSuspend={onToggleSuspend}
              onDelete={onDelete}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default UsersTable;
