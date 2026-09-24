import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { allGroups } from "../data/allGroups";
import GroupCoverHeader from "../components/community/screenSix/GroupCoverHeader";
import GroupTabs from "../components/community/screenSix/GroupTabs";
import GroupDiscussionTab from "../components/community/screenSix/GroupDiscussionTab";
import GroupMembersTab from "../components/community/screenSix/GroupMembersTab";
import GroupAboutCard from "../components/community/screenSix/GroupAboutCard";
import EmptyStateCard from "../components/community/screenSix/EmptyStateCard";

const currentUser = { name: "You", avatar: "/avatar1.png" };

const GroupDetailPage = () => {
  const { id } = useParams();
  const [groups, setGroups] = useState(allGroups);
  const [activeTab, setActiveTab] = useState("Discussion");
  const [posts, setPosts] = useState([]);

  const group = groups.find((g) => g.id === id);

  const handleToggleJoin = (groupId) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, isJoined: !g.isJoined } : g,
      ),
    );
  };

  const handleCreatePost = (text) => {
    setPosts((prev) => [
      {
        id: `p${Date.now()}`,
        author: currentUser,
        location: group.name,
        timeAgo: "Just now",
        text,
        image: null,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      ...prev,
    ]);
  };

  if (!group) {
    return (
      <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 text-center">
        <p className="text-gray-500">Group not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <GroupCoverHeader group={group} onToggleJoin={handleToggleJoin} />

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <GroupTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            {activeTab === "Discussion" && (
              <GroupDiscussionTab
                currentUser={currentUser}
                posts={posts}
                onCreatePost={handleCreatePost}
              />
            )}

            {activeTab === "Members" && <GroupMembersTab />}

            {activeTab === "Events" && <EmptyStateCard />}

            {activeTab === "Media" && <EmptyStateCard />}
          </div>

          <div className="w-full lg:w-72 shrink-0">
            <GroupAboutCard group={group} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;