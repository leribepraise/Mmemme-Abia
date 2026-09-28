import { HeadphonesIcon } from "lucide-react";

const SupportBox = () => {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
      <div className="bg-gray-200/50 p-2.5 rounded-lg h-fit text-[#48782E]">
        <HeadphonesIcon className="w-6 h-6" />
      </div>

      <div>
        <h4 className="font-bold text-sm text-gray-900">Contact Support</h4>

        <p className="text-xs text-gray-500 font-medium">
          Message our team with payment questions.
        </p>
      </div>
    </div>
  );
};

export default SupportBox;
