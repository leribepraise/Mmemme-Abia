import { Link } from "react-router-dom";
import { UserX } from "lucide-react";

const UserNotFound = ({ id }) => (
  <div className="p-4 sm:p-6">
    <div className="mx-auto flex max-w-md flex-col items-center rounded-xl bg-white px-6 py-12 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3f6f1]">
        <UserX className="h-7 w-7 text-[#1a6a2a]" />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-slate-800 sm:text-xl">
        User not found
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        We couldn't find a user with the ID "{id}".
      </p>
      <Link
        to="/admin/users"
        className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#14481f] px-5 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
      >
        Back to Users
      </Link>
    </div>
  </div>
);

export default UserNotFound;
