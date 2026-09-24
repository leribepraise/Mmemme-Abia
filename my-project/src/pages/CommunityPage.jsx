import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import CommunityHeader from "../components/community/screenOne/CommunityHeader";
import CreatePostBox from "../components/community/screenOne/CreatePostBox";
import CommunityTabs from "../components/community/screenOne/CommunityTabs";
import PostFeed from "../components/community/screenOne/PostFeed";
import { loadPosts } from "../data/communityPosts";
import MyGroupsList from "../components/community/screenTwo/MyGroupsList";
import { myGroups } from "../data/communityGroups";
import ChatsTabContent from "../components/community/screenThree/ChatsTabContent";
import { useUser } from "../components/context/UserContext";

const CommunityPage = () => {
  const location = useLocation();
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState(
    location.state?.openChatWithUserId || location.state?.openChatsTab
      ? "Chats"
      : "For You",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState(() => loadPosts());
  const [groups] = useState(myGroups);

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const query = searchTerm.toLowerCase();
    return posts.filter(
      (p) =>
        p.text?.toLowerCase().includes(query) ||
        p.author.name.toLowerCase().includes(query),
    );
  }, [posts, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-5">
        <CommunityHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <CreatePostBox currentUser={user} />
        <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "For You" && <PostFeed posts={filteredPosts} />}

        {activeTab === "Trending" && (
          <p className="text-center text-gray-500 py-10">
            Trending posts coming soon.
          </p>
        )}

        {activeTab === "My Groups" && <MyGroupsList groups={groups} />}

        {activeTab === "Chats" && <ChatsTabContent />}
      </div>
    </div>
  );
};

export default CommunityPage;
