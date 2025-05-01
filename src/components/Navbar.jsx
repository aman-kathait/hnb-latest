import React from "react";
import { Search, Bell, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  console.log("User object from navbar:", user);
  return (
    <div className="fixed top-0 left-0 w-full bg-[#1D5C3B] shadow-lg z-50">
      <div className="max-w-7xl mx-7">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo & Title */}
          <div className="flex items-center">
            <img className="h-9 mr-2" src="hnblogo.png" alt="HNB Logo" />
            <h1 className="text-lg md:text-2xl font-bold text-white">
              HNB <span className="text-[#B9FBC0]">Connect</span>
            </h1>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center flex-1 pl-30">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search here..."
                className="w-144 pl-10 pr-4 py-2 text-sm font-medium bg-[#DCEDC8] border border-green-300 rounded-lg text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500 h-4 w-4" />
            </div>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-3 md:space-x-5 gap-3">
            <Link to="/chat">
              <MessageCircle className="h-6 w-6 text-white hover:text-[#B9FBC0] transition duration-200" />
            </Link>
            <Link to="/notifications">
              <Bell className="h-6 w-6 text-white hover:text-[#B9FBC0] transition duration-200" />
            </Link>
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="w-8 h-8 border border-white hover:ring-2 hover:ring-green-400 transition">
                <AvatarImage src={user?.profilePicture} alt="@user" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
