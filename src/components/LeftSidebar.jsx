import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageSquareMore,
  PlusSquare,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import EventPost from "./EventPost";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";
import { setSelectedPost, setPosts } from "@/redux/postSlice";
import RoleBadge from "./RoleBadge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
  const dispatch = useDispatch();
  const [eventOpen, setEventOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User details from backend in left side bar:", user);
    }
  }, [user]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An unexpected error occurred");
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case "Log Out":
        logoutHandler();
        break;
      case "Create Post":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Home":
        navigate("/");
        break;
      case "Announcements":
        navigate("/announcements");
        break;
      case "Messages":
        navigate("/chat");
        break;
      case "Event Post":
        setEventOpen(true);
        break;
      default:
        break;
    }
  };

  const baseSidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Megaphone />, text: "Announcements" },
    { icon: <MessageSquareMore />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create Post" },
    ...(user?.role === 'faculty' ? [{ icon: <PlusSquare />, text: "Event Post" }] : []),
    { icon: <LogOut />, text: "Log Out" },
  ];

  const sidebarItems =
    user?.role === "faculty"
      ? [...baseSidebarItems, { icon: <CalendarDays />, text: "Event Post" }]
      : baseSidebarItems;

  return (
    <div className="hidden md:block fixed top-16 bg-[#EAF4EC] z-10 left-0 px-4 border-r min-w-[20%] h-screen">
      <div className="flex items-center mt-8 bg-[#2F7B48] p-1 rounded-lg pt-2 pb-2 pl-2">
        <div className="flex" onClick={() => sidebarHandler("Profile")}>
          <Avatar className="w-15 h-15 cursor-pointer">
            <AvatarImage src={user?.profilePicture} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="ml-3">
          <div
            className="flex font-semibold cursor-pointer hover:underline text-white"
            onClick={() => sidebarHandler("Profile")}
          >
            {user?.fullName}
            {user?.role && (
              <div className="text-xs mt-1 text-white flex items-center justify-center ml-1">
                <RoleBadge role={user.role} />
              </div>
            )}
          </div>

          <div className="text-sm font-semibold font-sans text-[#B9FBC0]">
            {user?.department}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {sidebarItems.map((item, index) => {
          // Handle Notifications separately with popover
          if (item.text === "Notifications") {
            return (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <div
                    className="flex items-center gap-3 relative hover:bg-[#CFE6D8] hover:text-[#134327] cursor-pointer rounded-lg p-3 my-3 mt-4 font-semibold text-[#083015]"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                    {likeNotification.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10">
                        {likeNotification.length}
                      </span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-72 z-50">
                  {likeNotification.length === 0 ? (
                    <p className="text-sm text-gray-500">No new notifications</p>
                  ) : (
                    likeNotification.map((notification) => (
                      <div key={notification.userId} className="flex items-center gap-2 my-2">
                        <Avatar>
                          <AvatarImage
                            src={notification.userDetails?.profilePicture}
                            alt="User"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">
                          <span className="font-bold">
                            {notification.userDetails?.username}
                          </span>{" "}
                          liked your post
                        </p>
                      </div>
                    ))
                  )}
                </PopoverContent>
              </Popover>
            );
          }

          // Normal items
          return (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-3 hover:bg-[#CFE6D8] hover:text-[#134327] cursor-pointer rounded-lg p-3 my-3 mt-4 font-semibold text-[#083015]"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
      {/* uncomment next line to open create event section for every role */}
      <EventPost open={eventOpen} setOpen={setEventOpen} />
      {/* {user?.role === "faculty" && (
        <EventPost open={eventOpen} setOpen={setEventOpen} />
      )} */}
    </div>
  );
};

export default LeftSidebar;
