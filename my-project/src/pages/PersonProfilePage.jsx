import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { allPeople } from "../data/communityPeople";
import PersonCoverHeader from "../components/community/screenSeven/PersonCoverHeader";
import PersonTabs from "../components/community/screenSeven/PersonTabs";
import PhotosGrid from "../components/community/screenSeven/PhotosGrid";
import PersonGroupsTab from "../components/community/screenSeven/PersonGroupsTab";
import PostCard from "../components/community/screenOne/PostCard";
import EmptyStateCard from "../components/community/screenSix/EmptyStateCard";
import { loadPosts } from "../data/communityPosts";
import { useUser } from "../components/context/UserContext";

const PersonProfilePage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [people, setPeople] = useState(allPeople);
  const [activeTab, setActiveTab] = useState("Posts");

  const person = people.find((p) => p.id === id);
  const isOwnProfile = person?.name === user?.fullName;

  const handleToggleFollow = (personId) => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId ? { ...p, isFollowing: !p.isFollowing } : p,
      ),
    );
  };

  const handleAddPhoto = (photoDataUrl) => {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, photos: [photoDataUrl, ...p.photos] } : p,
      ),
    );
  };

  if (!person) {
    return (
      <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 text-center">
        <p className="text-gray-500">Person not found.</p>
      </div>
    );
  }

  const personPosts = loadPosts().filter(
    (post) => post.author.name === person.name,
  );

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <PersonCoverHeader
          person={person}
          onToggleFollow={handleToggleFollow}
        />

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <PersonTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === "Posts" && (
          <div className="space-y-4">
            {personPosts.length > 0 ? (
              personPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <EmptyStateCard message="No posts yet." />
            )}
          </div>
        )}

        {activeTab === "Photos" &&
          (person.photos.length > 0 || isOwnProfile ? (
            <PhotosGrid
              photos={person.photos}
              isOwnProfile={isOwnProfile}
              onAddPhoto={handleAddPhoto}
            />
          ) : (
            <EmptyStateCard message="No photos shared yet." />
          ))}

        {activeTab === "Groups" && (
          <PersonGroupsTab groupIds={person.groupIds} />
        )}
      </div>
    </div>
  );
};

export default PersonProfilePage;
