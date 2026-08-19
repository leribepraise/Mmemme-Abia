import { Lock, CheckCircle, HeadphonesIcon } from "lucide-react";

const TrustBadgesCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="flex gap-4">
        <div className="bg-green-50 p-2.5 rounded-lg h-fit text-[#48782E]">
          <Lock className="w-6 h-6" />
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">Secured Checkout</h4>

          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Your payment is protected by a secured encryption
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100"></div>

      <div className="flex gap-4">
        <div className="bg-green-50 p-2.5 rounded-lg h-fit text-[#48782E]">
          <CheckCircle className="w-6 h-6" />
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">Instant Confirmation</h4>

          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            You'll receive your ticket immediately.
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100"></div>

      <div className="flex gap-4">
        <div className="bg-green-50 p-2.5 rounded-lg h-fit text-[#48782E]">
          <HeadphonesIcon className="w-6 h-6" />
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-1">24/7 Support</h4>

          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            We are here to help you anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustBadgesCard;
