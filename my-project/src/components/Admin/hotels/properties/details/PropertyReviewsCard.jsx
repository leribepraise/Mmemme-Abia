import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { DetailCard } from "./PropertyDetailParts";

const initials = (name) =>
  String(name)
    .split(" ")
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

const PropertyReviewsCard = ({ reviews }) => (
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
        <div key={review.id} className="rounded-lg bg-slate-50 p-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f3d1b] text-xs font-semibold text-white">
              {initials(review.name)}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900">
                {review.name}
              </p>
              <p className="text-[11px] text-slate-400">{review.timeAgo}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <p className="mt-1.5 text-sm text-slate-600">{review.text}</p>
        </div>
      ))}
    </div>
  </DetailCard>
);

export default PropertyReviewsCard;
