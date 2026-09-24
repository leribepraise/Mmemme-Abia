import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Settings,
  X,
  Image as ImageIcon,
  BarChart3,
  Smile,
  MapPin,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "../components/context/UserContext";
import { loadPosts, savePosts } from "../data/communityPosts";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [visibility, setVisibility] = useState("Public");

  const firstName = user?.fullName?.split(" ")[0] || "there";

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        }),
    );

    Promise.all(readers).then((results) => {
      setImages((prev) => [...prev, ...results]);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (!text.trim() && images.length === 0) {
      toast.error("Write something or add a photo before posting.");
      return;
    }

    const newPost = {
      id: `p${Date.now()}`,
      author: { name: user?.fullName || "You", avatar: user?.profilePicture },
      location: "Abia State",
      timeAgo: "Just now",
      text,
      image: images[0] || null,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    const existing = loadPosts();
    savePosts([newPost, ...existing]);

    toast.success("Post shared!");
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] flex items-start sm:items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate("/community")}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="font-bold text-base text-[#172033]">Create Post</h2>

          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/community")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* USER PROMPT */}
        <div className="px-5 py-4 flex items-center gap-3">
          <img
            src={user?.profilePicture || "/avatar-placeholder.png"}
            alt=""
            className="w-9 h-9 rounded-full object-cover shrink-0"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`What's on your mind, ${firstName}?`}
            rows={2}
            className="flex-1 text-sm outline-none resize-none placeholder:text-gray-400"
            autoFocus
          />
        </div>

        {/* IMAGE PREVIEW GRID */}
        {images.length > 0 && (
          <div className="px-5 pb-4 grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden">
                <img src={img} alt="" className="w-full h-40 object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ADD TO POST */}
        <div className="border-t border-gray-200 px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">
            ADD TO YOUR POST
          </p>

          <div className="flex items-center justify-between">
            <label className="flex flex-col items-center gap-1 cursor-pointer">
              <ImageIcon className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-600">Photo/Video</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
                className="hidden"
              />
            </label>

            <button className="flex flex-col items-center gap-1">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              <span className="text-xs text-gray-600">Poll</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <Smile className="w-5 h-5 text-yellow-500" />
              <span className="text-xs text-gray-600">Feeling</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="text-xs text-gray-600">Location</span>
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 flex items-center gap-3">
          <div className="relative">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium outline-none"
            >
              <option>Public</option>
              <option>Friends</option>
              <option>Only Me</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handlePost}
            className="flex-1 bg-[#3F783D] hover:bg-[#356433] text-white font-semibold py-2.5 rounded-lg transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
