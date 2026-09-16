import React from "react";
import { Star } from "lucide-react";

const RestaurantReview = () => {
  return (
    <section>
      <h2 className="font-bold text-sm mb-3">What People Say</h2>

      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <img
            src="/review-user.jpg"
            alt="Reviewer"
            className="w-8 h-8 rounded-full object-cover"
          />

          <div>
            <h3 className="text-[10px] font-bold">Adaeze M.</h3>

            <p className="text-[8px] text-gray-400">Apr 28, 2024</p>
          </div>
        </div>

        <p className="text-[9px] text-gray-600 italic leading-relaxed mt-3">
          "The food is amazing and the environment is so relaxing! The Egusi
          soup was the best I've had in a long time."
        </p>

        <div className="flex gap-0.5 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-3 h-3 text-orange-500 fill-orange-500"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantReview;
