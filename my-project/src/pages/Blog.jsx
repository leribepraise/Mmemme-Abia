import React from "react";
import {
  Search,
  Image as ImageIcon,
  Smile,
  MoreHorizontal,
  Heart,
  MessageSquare,
} from "lucide-react";

const Community = () => {
  return (
    <div className="min-h-screen bg-[#F6F7F3] px-4 py-5 md:px-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[40px] font-normal text-[#191C1D]">Community</h1>

          <p className="text-[18px] text-[#41493E] font-semibold">
            Connect, share and grow together across Abia
          </p>
        </div>

        <button className="text-gray-600 hover:text-black">
          <Search size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-4 max-w-[400px]">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search posts, groups, people..."
          className="h-9 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-[14px] outline-none focus:border-green-700 placeholder:text-[#6B7280] font-normal"
        />
      </div>

      {/* Create Post */}
      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-3">
            <img
              src="/blog.jpg"
              alt="User"
              className="h-8 w-8 rounded-full object-cover"
            />

            <input
              type="text"
              placeholder="Share something with the community..."
              className="flex-1 text-[14px] font-normal outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-3 text-green-700">
            <ImageIcon size={18} />
            <Smile size={18} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-6 border-b border-gray-200 pb-2 text-[11px] font-medium">
        <button className="border-b-2 border-[#265F27] pb-2 text-[#265F27]">
          For You
        </button>

        <button className="pb-2 text-[#41493E] text-[14px] font-normal">
          Following
        </button>

        <button className="pb-2 text-[#41493E] text-[14px] font-normal">
          Trending
        </button>
      </div>

      {/* Post */}
      <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <img
                src="/blog2.jpg"
                alt="User"
                className="h-9 w-9 rounded-full object-cover"
              />

              <div>
                <h3 className="text-[14px] font-normal text-[#191C1D]">
                  Chinedu Okafor
                </h3>

                <p className="text-[12px] font-normal text-[#41493E]">
                  Umuahia, Abia State · 2h
                </p>
              </div>
            </div>

            <MoreHorizontal size={18} className="text-gray-500" />
          </div>

          <p className="mt-4 text-[12px] leading-5 text-gray-800">
            The Arochukwu Long Juju monument is such a beautiful piece of our
            history and culture. Abia is blessed! ❤️
          </p>
        </div>

        <img
          src="/blog3.jpg"
          alt="Arochukwu Long Juju"
          className="h-[320px] w-full object-cover"
        />

        <div className="p-4">
          <div className="flex items-center justify-between text-[11px] text-gray-600">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1">
                <Heart size={15} className="fill-red-500 text-red-500" />

                <span>106</span>
              </div>

              <div className="flex items-center gap-1">
                <MessageSquare size={15} />

                <span>45</span>
              </div>
            </div>

            <span>45 comments · 12 shares</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
