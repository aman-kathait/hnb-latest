import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Home, Megaphone, PlusSquare, Search, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import EventPost from './EventPost';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import { setSelectedPost, setPosts } from '@/redux/postSlice';
import API_URL from '@/config/api';

const Footer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const [eventOpen, setEventOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/user/logout`, {
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

  const footerHandler = (textType) => {
    switch (textType) {
      case "Logout":
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
      case "Search":
        navigate("/search");
        break;
      case "Event Post":
        setEventOpen(true);
        break;
      default:
        break;
    }
  };

  const footerItems = [
    { icon: <Home  />, text: "Home" },
    { icon: <Megaphone  />, text: "Announcements" },
    { icon: <Search  />, text: "Search" },
    { icon: <PlusSquare  />, text: "Create Post" },
    ...(user?.role === 'faculty' ? [{ icon: <CalendarDays size={20} />, text: "Event Post" }] : []),
  ];

  return (
    <div className="md:hidden w-full h-16 fixed bottom-0 left-0 flex justify-center items-center bg-white border-t z-50">
      <div className="flex justify-around items-center w-full h-full">
        {footerItems.map((item, index) => (
          <div
            key={index}
            onClick={() => footerHandler(item.text)}
            className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
          >
            {item.icon}
          </div>
        ))}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
      {user?.role === "faculty" && (
        <EventPost open={eventOpen} setOpen={setEventOpen} />
      )}
    </div>
  );
};

export default Footer;