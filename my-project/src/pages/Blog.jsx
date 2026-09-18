import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  Share2,
  Calendar,
  ArrowRight,
} from "lucide-react";

const recentPosts = [
  {
    title: "Top 10 Events You Shouldn't Miss This August",
    date: "August 1, 2026",
    image: "/blog/event1.jpg",
  },
  {
    title: "Abia: Surprises in Every Turn",
    date: "August 4, 2026",
    image: "/blog/event2.jpg",
  },
  {
    title: "How to Plan a Successful Event In Abia State",
    date: "August 6, 2026",
    image: "/blog/event3.jpg",
  },
  {
    title: "Best Venues for Corporate Events in Abia",
    date: "August 10, 2026",
    image: "/blog/event4.jpg",
  },
  {
    title: "Top 5 Local Dishes to Try at Abia Events.",
    date: "July 30, 2026",
    image: "/blog/event5.jpg",
  },
];

const categories = [
  { name: "Music", count: 24 },
  { name: "Business", count: 18 },
  { name: "Culture", count: 32, active: true },
  { name: "Sports", count: 14 },
  { name: "Food & Drinks", count: 10 },
  { name: "Faith", count: 16 },
];

const tags = ["Culture", "Festival", "Tours", "Abia", "Tourism", "Heritage"];

const festivalList = [
  { name: "New Yam Festival", date: "August" },
  { name: "Ofara Festival", date: "October" },
  { name: "Arochinwa Masquerade Festival", date: "December" },
  { name: "Iguikwuata Dance Festival", date: "November" },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#F6F7F3] text-gray-900 font-sans">
      {/* NAVBAR */}
      {/* BREADCRUMBS MATCHING SCREENSHOT */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#265F27] transition">Home</Link>
          <span className="text-gray-400">›</span>
          <Link to="/blog" className="hover:text-[#265F27] transition">Blog</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-500 truncate">Abia Cultural Festivals You Should Not Miss in 2026</span>
        </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 lg:px-12 py-6">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#265F27]">Home</Link>
          <span>›</span>
          <Link to="/blog" className="hover:text-[#265F27]">Blog</Link>
          <span>›</span>
          <span className="text-gray-900 truncate">Abia Cultural Festivals You Should Not Miss in 2026</span>
        </nav>

        {/* THREE COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: RECENT POSTS & NEWSLETTER */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-4">Recent Posts</h3>
              <div className="space-y-4">
                {recentPosts.map((post, idx) => (
                  <div key={idx} className="flex items-start gap-3 group cursor-pointer">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-14 rounded-xl object-cover shrink-0 bg-gray-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#265F27] transition line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="mt-1 text-[10px] font-semibold text-gray-400">
                        {post.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
              <h3 className="text-sm font-black text-gray-900">Subscribe to our newsletter</h3>
              <p className="mt-1.5 text-xs text-gray-500 font-medium leading-relaxed">
                Get the latest event updates, and cultures insights from Abia.
              </p>
              <div className="mt-4 space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold outline-none focus:border-[#265F27] placeholder:text-gray-400"
                />
                <button
                  type="button"
                  className="w-full h-10 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white text-xs font-black shadow-sm transition"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </aside>

          {/* CENTER CONTENT: ARTICLE BODY */}
          <article className="lg:col-span-6 bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm">
            <div className="relative h-72 sm:h-96 w-full bg-gray-900">
              <img
                src="/blog/feature.jpg"
                alt="Abia Cultural Festivals"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-block bg-[#265F27] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-lg shadow-md">
                  Culture
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Abia Cultural Festivals You Should Not Miss in 2026
              </h1>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-3">
                  <img src="/chioma.jpg" alt="Chioma" className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <span className="font-extrabold text-gray-900 block">By Chioma</span>
                    <span className="text-[11px] text-gray-400">May 10, 2026 · 8 min read</span>
                  </div>
                </div>

                {/* Social Share Icons */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 mr-1">Share:</span>
                  {/* Facebook */}
                  <a href="#facebook" className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  {/* Twitter / X */}
                  <a href="#twitter" className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  {/* WhatsApp */}
                  <a href="#whatsapp" className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:opacity-90 transition">
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                  {/* LinkedIn */}
                  <a href="#linkedin" className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-90 transition">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                </div>
              </div>

              <p className="mt-6 text-sm md:text-base text-gray-700 font-medium leading-relaxed">
                Abia State is rich in culture, tradition, and vibrant celebrations that bring communities together. Here are must-attend festivals this year...
              </p>

              <h2 className="mt-8 text-xl font-black text-gray-900 tracking-tight">
                Top Cultural Festivals In Abia
              </h2>

              <div className="mt-4 space-y-3">
                {festivalList.map((fest, index) => (
                  <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#265F27]/10 text-[#265F27] flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                        {fest.name} - <span className="text-gray-500 font-semibold">{fest.date}</span>
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* RIGHT SIDEBAR: CATEGORIES & TAGS */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2.5">
                {categories.map((cat, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      cat.active
                        ? "text-[#F97316] bg-orange-50/60"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 font-semibold">({cat.count})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600 hover:border-[#265F27] hover:text-[#265F27] transition cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}