import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import useFollowUser from "@/hooks/useFollowUser"; // Import custom hook
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner"; // If you're using toast notifications
import RoleBadge from "./RoleBadge";
const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");

  // Use the new follow hook
  const { followOrUnfollow, loading } = useFollowUser();

  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;

  // Check if the current user is following this profile
  const isFollowing = user?.following?.some(
    (followingId) =>
      followingId === userProfile?._id ||
      (typeof followingId === "object" && followingId._id === userProfile?._id)
  );

  const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);

  useEffect(() => {
    setLocalIsFollowing(isFollowing);
  }, [isFollowing]);

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  // Handle follow/unfollow action
  const handleFollowUnfollow = async () => {
    // Toggle local state immediately for better UX
    setLocalIsFollowing((prev) => !prev);
    try {
      await followOrUnfollow(userId);
      // Rest of the function
    } catch (error) {
      // If error, revert the local state
      setLocalIsFollowing((prev) => !prev);
      // Rest of error handling
      console.error("Failed to follow/unfollow:", error);
      toast.error("Failed to follow/unfollow user");
    }
  };

  console.log("User following:", user?.following);
  console.log("Profile user ID:", userProfile?._id);
  console.log("Is following:", isFollowing);

  return (
    <div className="flex justify-center w-full px-4 py-8 mt-14 ml-40 bg-[#F4FFF6] h-screen">
      <div className="w-full max-w-6xl">
        {/* Top Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center mb-12">
          {/* Avatar */}
          <div className="flex justify-center ml-2">
            <Avatar className="w-32 h-32 border-4 border-white shadow-md">
              <AvatarImage src={userProfile?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* Info Section */}
          <div className="md:col-span-4">
            <div className="flex flex-col gap-4">
              {/* Username and Buttons */}
              <div>
              <div className="flex items-center flex-wrap gap-4 ">
                <span className="text-2xl font-semibold text-gray-900">
                  {userProfile?.fullName}
                  <span className="">
                    {" "}
                    <RoleBadge role={userProfile?.role || "norole"} />
                  </span>
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
                <p className="text-sm text-gray-600"></p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 mb-4">
          <div className="flex justify-center space-x-10 text-sm font-medium mt-4">
            {["posts", "saved", "tags"].map((tab) => (
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

        {/* Posts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 m-3">
          {Array.isArray(displayedPost) ? [...displayedPost].reverse().map((post) => (
            <div key={post?._id} className="relative group cursor-pointer">
              <img
                src={post.image}
                alt="post"
                className="aspect-square object-cover w-full rounded-sm"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="flex items-center space-x-6 text-white">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>{post?.likes?.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post?.comments?.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            
            <div className="col-span-full text-center py-10 text-gray-500">
              No posts to display
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
