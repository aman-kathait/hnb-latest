import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  MessageSquareMore,
  MessageSquareText,
  Megaphone ,
  CalendarDays 


} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./CreatePost";
import EventPost from "./EventPost";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";
import { setSelectedPost, setPosts } from "@/redux/postSlice";
const LeftSidebar = () => {
  
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  console.log("User object from Redux:", user);
  const dispatch = useDispatch();
  const [eventOpen, setEventOpen] = useState(false);
  const [open, setOpen] = useState(false);
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
      toast.error(
        error.response.data.message || "An unexpected error occurred"
      );
    }
  };
  const sidebarHandler = (textType) => {
    if (textType === "Log Out") {
      logoutHandler();
    } else if (textType === "Create Post") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    } else if (textType === "Event Post") {
      setEventOpen(true);
    }
  };
  const sidebarItems = [
      // icon: (
      //   <Avatar className="w-7 h-7">
      //     <AvatarImage src={user?.profilePicture} alt="@shadcn" />
      //     <AvatarFallback>CN</AvatarFallback>
      //   </Avatar>
      // ),
      // text: "Profile",
    
    { icon: <Home />, text: "Home" },
    { icon: <Megaphone />, text: "Announcement" },
    { icon: <MessageSquareMore />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create Post" },
    {icon: <CalendarDays />, text: "Event Post" },
    { icon: <LogOut />, text: "Log Out" },
  ];
  console.log("User data:", user);
  return (
    <div className="hidden md:block fixed top-16  bg-[#EAF4EC] z-10 left-0 px-4 border-r w-[19%] h-screen">
      <div className="flex  items-center mt-8 bg-[#2F7B48] p-1 rounded-lg pt-2 pb-2 pl-2 "> 
        <div className="flex" onClick={()=>sidebarHandler("Profile")}>
        <Avatar className="w-15 h-15 cursor-pointer ">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        </div>
        

        <div className="ml-3">
          <div className="font-semibold cursor-pointer hover:underline text-white">
          {user.fullName}
          {/* {user.username} */}
          </div>
          <div className="text-sm font-semibold font-sans text-[#B9FBC0]">
          
          {user.department}
          </div>
          
         
        </div>
      
      </div>
      <div className="flex flex-col">
        {/* <div className='flex items-center justify-center'>
        <img src='hnblogo.png' className='mx-auto h-16 w-16 '></img>
        <h1 className='my-8 pl-3 font-bold text-xl text-green-500'>HNB <span className='text-black'> CONNECT</span></h1>
        </div> */}

        <div className="">
          {sidebarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center jus gap-3 relative hover:bg-[#CFE6D8] hover:text-[#134327] cursor-pointer rounded-lg p-3 my-3 mt-4 font-semibold text- text-[#083015]"
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
      <EventPost open={eventOpen} setOpen={setEventOpen} />
    </div>
  );
};

export default LeftSidebar;
