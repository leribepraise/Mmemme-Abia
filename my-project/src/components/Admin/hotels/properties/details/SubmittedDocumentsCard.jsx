import { FileText, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard, DocumentStatusPill } from "./PropertyDetailParts";

const KIND_ICON = { pdf: FileText, image: ImageIcon };
const KIND_LABEL = { pdf: "PDF", image: "Image" };
const KIND_TONE = {
  pdf: "bg-rose-50 text-rose-500",
  image: "bg-sky-50 text-sky-500",
};

const SubmittedDocumentsCard = ({ documents }) => (
  <DetailCard
    title="Submitted Documents"
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
      {documents.map((doc) => {
        const Icon = KIND_ICON[doc.kind] || FileText;
        return (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${KIND_TONE[doc.kind] || "bg-slate-100 text-slate-500"}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {doc.title}
                </p>
                <p className="text-xs text-slate-500">
                  {KIND_LABEL[doc.kind] || doc.kind} • {doc.size}
                </p>
              </div>
            </div>
            <DocumentStatusPill status={doc.status} />
          </div>
        );
      })}
    </div>
  </DetailCard>
);

export default SubmittedDocumentsCard;
