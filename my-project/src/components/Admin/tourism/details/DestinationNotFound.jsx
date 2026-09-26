import { Link } from "react-router-dom";

const DestinationNotFound = () => (
  <div className="p-4 sm:p-6">
    <div className="rounded-xl bg-white p-8 text-center shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">
        Destination not found
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        This destination doesn't exist or may have been removed.
      </p>
      <Link
        to="/admin/tourism"
        className="mt-5 inline-flex h-9 items-center rounded-lg bg-[#14481f] px-4 text-sm font-medium text-white transition-colors hover:bg-[#0f3a19]"
      >
        Back to Listings
      </Link>
    </div>
  </div>
);

export default DestinationNotFound;
