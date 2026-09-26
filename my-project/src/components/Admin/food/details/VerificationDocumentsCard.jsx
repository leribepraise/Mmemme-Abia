import { FileText } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard, DocumentStatusPill } from "./FoodDetailParts";

const VerificationDocumentsCard = ({
  documents,
  title = "Verification Documents",
}) => (
  <DetailCard
    title={title}
    action={
      <button
        type="button"
        onClick={() => toast("Viewing all documents isn't built yet")}
        className="text-sm font-medium text-[#1a6a2a] hover:underline"
      >
        View All Documents
      </button>
    }
  >
    <div className="space-y-2.5">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
              <FileText className="h-4 w-4" />
            </span>
            <p className="truncate text-sm font-medium text-slate-900">
              {doc.title}
            </p>
          </div>
          <DocumentStatusPill status={doc.status} />
        </div>
      ))}
    </div>
  </DetailCard>
);

export default VerificationDocumentsCard;
