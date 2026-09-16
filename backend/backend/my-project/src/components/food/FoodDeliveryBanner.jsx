import React from "react";
import { ArrowRight } from "lucide-react";

const FoodDeliveryBanner = () => {
  return (
    <section className="border border-[#48782E] bg-[#F1FAF1] rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
      <div className="flex items-center gap-4">
        <img
          src="/food-delivery.jpg"
          alt="Food delivery"
          className="w-12 h-12 rounded-lg object-cover"
        />

        <div>
          <h3 className="font-bold text-xs md:text-sm text-[#166534]">
            Free Delivery on Orders ₦5,000 and above!
          </h3>

          <p className="text-[8px] md:text-[10px] text-gray-500 mt-1">
            Enjoy tasty meals from your favorite vendors with fast and reliable
            delivery.
          </p>

          <div className="flex gap-1 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#48782E]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </div>

      <button className="bg-[#064E3B] hover:bg-[#064b36] text-white px-7 py-3 rounded-lg text-[14px] font-medium flex items-center gap-2 whitespace-nowrap cursor-pointer">
        Order Now
        <ArrowRight className="w-3 h-3" />
      </button>
    </section>
  );
};

export default FoodDeliveryBanner;
