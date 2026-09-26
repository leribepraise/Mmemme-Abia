import { FileText } from "lucide-react";
import toast from "react-hot-toast";
import { ApprovalCard } from "./ApprovalParts";

const ApprovalDocuments = ({ documents }) => (
  <ApprovalCard title="Uploaded Documents">
    <ul className="space-y-3">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-50">
              <FileText className="h-4 w-4 text-red-500" />
            </span>
            <span className="truncate text-sm font-medium text-slate-800">
              {doc.title}
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast("Document viewer isn't built yet")}
            className="shrink-0 text-sm font-medium text-[#1a6a2a] hover:underline"
          >
            View
          </button>
        </li>
      ))}
    </ul>
  </ApprovalCard>
);

export default ApprovalDocuments;
