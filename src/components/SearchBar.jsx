import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react"; // or your preferred icon library
import { Link, useNavigate } from 'react-router-dom';
import RoleBadge from "./RoleBadge";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const SearchBar = () => {
  const { suggestedUsers = [] } = useSelector((store) => store.auth || {});
  const usersList = useMemo(() => suggestedUsers, [suggestedUsers]); // Memoize the users list
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Debounced search with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredUsers([]);
        return;
      }

      const filtered = usersList.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, usersList]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleProfileClick = (userId) => {
    setSearchQuery("");
    setIsDropdownOpen(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="hidden md:flex items-center flex-1 pl-30">
      <div className="relative w-full max-w-md search-container">
        {/* Search Input */}
        <div className="relative w-144">
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 text-sm font-medium bg-[#DCEDC8] border border-green-300 rounded-lg text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 h-4 w-4" />
        </div>

        {/* Dropdown Results */}
        {isDropdownOpen && searchQuery && (
          <div className="absolute top-full left-0 w-full bg-white border border-green-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div 
                  key={user._id} 
                  className='p-2 hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleProfileClick(user._id)}
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.profilePicture} alt="profile" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className='flex flex-col'>
                        <div className='flex items-center gap-1'>
                          <h1 className='text-sm font-medium'>
                            {user?.fullName}
                          </h1>
                          <RoleBadge role={user?.role} className="text-xs" />
                        </div>
                        <p className="text-xs text-gray-600 font-semibold">
                          {user?.department || "Dept. not defined"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-gray-500">No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;