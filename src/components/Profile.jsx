import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import useGetUserPosts from "@/hooks/useGetUserPosts"; // Add this new import
import useFollowUser from "@/hooks/useFollowUser";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import RoleBadge from "./RoleBadge";
import Post from "./Post";
import { Download, FileText } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);

  // Add this new hook to get posts specifically for this profile
  const { posts: profilePosts, loading: postsLoading } =
    useGetUserPosts(userId);

  const [activeTab, setActiveTab] = useState("posts");

  const { followOrUnfollow, loading } = useFollowUser();
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  const isFollowing = user?.following?.some(
    (followingId) =>
      followingId === userProfile?._id ||
      (typeof followingId === "object" && followingId._id === userProfile?._id)
  );

  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);

  useEffect(() => {
    setLocalIsFollowing(isFollowing);
  }, [isFollowing]);

  // Use profilePosts instead of userPosts
  const displayedPost =
    activeTab === "posts" ? profilePosts : userProfile?.bookmarks;

  const handleFollowUnfollow = async () => {
    setLocalIsFollowing((prev) => !prev);
    try {
      await followOrUnfollow(userId);
    } catch (error) {
      setLocalIsFollowing((prev) => !prev);
      console.error("Failed to follow/unfollow:", error);
      toast.error("Failed to follow/unfollow user");
    }
  };

  // Add loading state for posts
  if (postsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-center w-full px-4 py-8 mt-14 bg-[#F4FFF6] min-h-screen">
      <div className="w-full max-w-6xl mx-auto">
        {/* Top Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center mb-12">
          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar className="w-32 h-32 border-4 border-white shadow-md">
              <AvatarImage src={userProfile?.profilePicture} alt="profile" />
              <AvatarFallback>
                {" "}
                {userProfile?.fullName
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info Section */}
          <div className="md:col-span-4 w-full">
            <div className="flex flex-col gap-4">
              <div>
                {/* Username and Buttons */}
                <div className="flex items-center flex-wrap gap-4">
                  <span className="text-2xl font-semibold text-gray-900">
                    {userProfile?.fullName}
                    <RoleBadge role={userProfile?.role || "norole"} />
                  </span>

                  {isLoggedInUserProfile ? (
                    <Link to="/account/edit">
                      <Button variant="outline" className="h-8">
                        Edit profile
                      </Button>
                    </Link>
                  ) : localIsFollowing ? (
                    <>
                      <Button
                        key={`follow-button-${localIsFollowing}`}
                        variant="outline"
                        className="h-8"
                        onClick={handleFollowUnfollow}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Unfollow"}
                      </Button>
                      <Button variant="outline" className="h-8">
                        Message
                      </Button>
                    </>
                  ) : (
                    <Button
                      key={`follow-button-${localIsFollowing}`}
                      className="bg-[#0095F6] hover:bg-[#1877f2] text-white h-8"
                      onClick={handleFollowUnfollow}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Follow"}
                    </Button>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    {userProfile?.department} ,{" "}
                    {userProfile?.graduationYear || "Not available"}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-700">
                <span>
                  <strong>{userProfile?.posts.length}</strong> posts
                </span>
                <span>
                  <strong>{userProfile?.followers.length}</strong> followers
                </span>
                <span>
                  <strong>{userProfile?.following.length}</strong> following
                </span>
              </div>

              {/* Bio Section */}
              <div className="space-y-1">
                <Badge
                  variant="secondary bg-gray-800"
                  className="w-fit text-sm"
                >
                  <span className="pl-1">
                    {userProfile?.rollnumber || "RollNo. Not available"}
                  </span>
                </Badge>

                {(userProfile?.bio || "bio here...")
                  .match(/.{1,25}/g)
                  ?.slice(0, 3)
                  .map((line, idx) => (
                    <p key={idx} className="text-sm text-gray-800 font-medium">
                      {line}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Download Section - Only shown for non-faculty users who have resumes */}
        {userProfile?.resumeUrl && userProfile.role !== "faculty" && (
          <div className="mt-3">
            {/* <h3 className="text-sm font-medium mb-1"></h3> */}
            <div className="flex gap-2">
              <a
                href={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
                  userProfile.resumeUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 ml-2"
              >
                <FileText size={16} />
                Resume
              </a>
              {/* <a 
                href={userProfile.resumeUrl}
                download={`${userProfile.fullName.replace(/\s+/g, '_')}_resume.pdf`}  // Use user's name with underscore and .pdf extension
                className='bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1'
              >
                <Download size={16} />
              </a> */}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-t border-gray-200 mb-4">
          <div className="flex justify-center space-x-10 text-sm font-medium mt-4">
            {["posts", "saved"].map((tab) => (
              <span
                key={tab}
                className={`cursor-pointer py-2 px-3 ${
                  activeTab === tab
                    ? "font-bold border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Posts Grid - now using profilePosts */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start m-3">
          {Array.isArray(displayedPost) && displayedPost.length > 0 ? (
            [...displayedPost]
              .reverse()
              .map((post) => (
                <Post
                  post={post}
                  key={post?._id}
                  className="w-[48%] sm:w-[30%] md:w-[23%] aspect-square"
                />
              ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500 w-full">
              No posts to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
