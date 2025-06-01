import React, { useState } from "react";
import { Search, Bell, MessageCircle, Menu } from "lucide-react"; // Added Menu icon
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import HnbLogo from "../assets/hnblogo.png";
import DropdownMenu from "./DropdownMenu"; // Import the dropdown menu

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Replace with real logout logic
    console.log("Logging out...");
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#1D5C3B] shadow-lg z-50">
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          {/* Left: Logo & Title */}
          <div className="flex items-center">
            <img className="h-9 mr-2" src={HnbLogo} alt="HNB Logo" />
            <h1 className="text-lg md:text-2xl font-bold text-white">
              HNB <span className="text-[#B9FBC0]">Connect</span>
            </h1>
          </div>

          {/* Center: SearchBar (centered on md and above) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1/2 max-w-md hidden sm:block">
            <SearchBar />
          </div>

          {/* Right: Icons and Hamburger for small screens */}
          <div className="flex items-center space-x-3 md:space-x-5 relative">
            {/* Desktop Icons */}
            <Link to="/chat" className="sm:inline-block hidden">
              <MessageCircle className="h-6 w-6 text-white hover:text-[#B9FBC0] transition duration-200" />
            </Link>
            {/* <Link to="/notifications" className="sm:inline-block hidden">
              <Bell className="h-6 w-6 text-white hover:text-[#B9FBC0] transition duration-200" />
            </Link> */}
            <Link to={`/profile/${user?._id}`} className="sm:inline-block hidden">
              <Avatar className="w-8 h-8 border border-white hover:ring-2 hover:ring-green-400 transition">
                <AvatarImage src={user?.profilePicture} alt="@user" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            {/* Hamburger Icon for Small Screens */}
            <button className="sm:hidden" onClick={() => setMenuOpen(prev => !prev)}>
              <Menu className="h-6 w-6 text-white hover:text-[#B9FBC0]" />
            </button>

            {/* Dropdown Menu for small screens */}
            {menuOpen && (
              <div className="absolute top-12 right-0 sm:hidden">
                <DropdownMenu onLogout={handleLogout} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
