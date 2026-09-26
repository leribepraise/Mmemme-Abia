import { Plus, Upload } from "lucide-react";
import toast from "react-hot-toast";

const UsersHeader = ({ onExport }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a] sm:text-2xl">Users</h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Manage and monitor all platform users.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toast("The Add User form isn't built yet")}
          className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg bg-[#14481f] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0f3a19] sm:flex-none"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add User
        </button>
        <button
          type="button"
          onClick={onExport}
          className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex-none"
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Export
        </button>
      </div>
    </div>
  );
};

export default UsersHeader;
