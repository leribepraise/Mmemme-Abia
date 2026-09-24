import Seo from "../components/seo/Seo";
import React, { useState } from "react";
import {
  Search,
  Image as ImageIcon,
  Smile,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Share2,
} from "lucide-react";

const Community = () => {
  const [activeTab, setActiveTab] = useState("For You");
  const tabs = ["For You", "Following", "Trending"];

  return (
    <div className="min-h-screen bg-[#F6F7F3] px-4 py-6 md:px-8 lg:px-12">
      <Seo title="Community" description="Connect with other people exploring Abia State — share posts, follow trending topics, and join the conversation." path="/community" />
      <div className="mx-auto max-w-3xl">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
              Community
            </h1>
            <p className="mt-1 text-base font-semibold text-gray-600 md:text-lg">
              Connect, share, and grow together across Abia State
            </p>
          </div>

          {/* RESPONSIVE SEARCH INPUT */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, groups, people..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#265F27] focus:ring-2 focus:ring-[#265F27]/20 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* CREATE POST CARD */}
        <div className="mt-6 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              <img
                src="/blog.jpg"
                alt="Your Avatar"
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-gray-100"
              />
              <input
                type="text"
                placeholder="Share something with the community..."
                className="w-full text-sm font-semibold text-gray-800 outline-none md:text-base placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-2 text-[#265F27]">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-[#265F27]/10"
                aria-label="Add image"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-[#265F27]/10"
                aria-label="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* FEED NAVIGATION TABS */}
        <div className="mt-6 flex border-b border-gray-200 text-sm font-extrabold md:text-base">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`mr-8 pb-3 transition ${
                activeTab === tab
                  ? "border-b-2 border-[#265F27] text-[#265F27]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* COMMUNITY POST CARD */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-md">
          {/* POST AUTHOR HEADER */}
          <div className="p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/blog2.jpg"
                  alt="Chinedu Okafor"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100"
                />
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 md:text-lg">
                    Chinedu Okafor
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 md:text-sm">
                    Umuahia, Abia State · 2h ago
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* POST BODY TEXT */}
            <p className="mt-4 text-sm font-medium leading-relaxed text-gray-800 md:text-base">
              The Arochukwu Long Juju monument is such a beautiful piece of our
              history and culture. Abia is truly blessed! ❤️
            </p>
          </div>

          {/* POST ATTACHMENT IMAGE */}
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <img
              src="/blog3.jpg"
              alt="Arochukwu Long Juju Monument"
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.01]"
            />
          </div>

          {/* POST METRICS & INTERACTIONS */}
          <div className="p-4 md:p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-gray-600 md:text-sm">
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-red-500 transition hover:opacity-80"
                >
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  <span>106</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-gray-600 transition hover:text-[#265F27]"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>45</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-gray-600 transition hover:text-[#265F27]"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>

              <span className="font-semibold text-gray-500">
                45 comments · 12 shares
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;