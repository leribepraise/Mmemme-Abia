import { MoreVertical, Star } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard } from "./DestinationDetailParts";

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const ReviewRow = ({ review }) => (
  <div className="rounded-lg bg-slate-50 p-3.5">
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2.5">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f3d1b] text-xs font-semibold text-white">
            {initials(review.name)}
          </span>
        )}
        <div>
          <p className="text-sm font-medium text-slate-900">{review.name}</p>
          <p className="text-[11px] text-slate-400">{review.timeAgo}</p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Review options"
        onClick={() => toast("Review options aren't built yet")}
        className="text-slate-400 hover:text-slate-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
    </div>

    <div className="mt-2 flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs font-semibold text-slate-800">
        {review.rating.toFixed(1)}
      </span>
    </div>
    <p className="mt-1.5 text-sm text-slate-600">{review.text}</p>
  </div>
);

const DestinationReviewsCard = ({ reviews }) => (
  <DetailCard
    title="Recent Reviews"
    action={
      <button
        type="button"
        onClick={() => toast("See all reviews isn't built yet")}
        className="text-sm font-medium text-[#1a6a2a] hover:underline"
      >
        See all reviews
      </button>
    }
  >
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewRow key={review.id} review={review} />
      ))}
    </div>
  </DetailCard>
);

export default DestinationReviewsCard;
