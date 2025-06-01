import React, { useState, useEffect, useMemo, forwardRef } from "react";
import { useSelector } from "react-redux";
import { Search, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import RoleBadge from "./RoleBadge";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SearchBar = forwardRef(({ onSearchComplete, fullScreenMode }, ref) => {
  const { suggestedUsers = [] } = useSelector((store) => store.auth || {});
  const usersList = useMemo(() => suggestedUsers, [suggestedUsers]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredUsers([]);
        return;
      }

      const filtered = usersList.filter((user) =>
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, usersList]);

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
    if (onSearchComplete) onSearchComplete();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      if (onSearchComplete) onSearchComplete();
    }
  };

  return (
    <div className={`${fullScreenMode ? 'fixed inset-0 bg-white z-50 flex flex-col' : 'hidden md:flex items-center w-full justify-center px-2'}`}>
      {fullScreenMode && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1 max-w-3xl mx-auto">
            <div className="relative w-full search-container">
              <div className="relative">
                <input
                  ref={ref}
                  type="text"
                  placeholder="Search here..."
                  className={`w-full pl-10 pr-4 py-3 text-base font-medium bg-white border-b border-gray-300 text-gray-800 placeholder:text-gray-600 focus:outline-none focus:border-green-500 ${fullScreenMode ? 'text-lg py-4' : ''}`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>
            </div>
          </div>
          <button 
            onClick={onSearchComplete}
            className="ml-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close search"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      )}

      {!fullScreenMode && (
        <div className="relative w-full max-w-md search-container">
          <div className="relative">
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
        </div>
      )}

      {/* Dropdown Results - works for both modes */}
      {isDropdownOpen && searchQuery && (
        <div className={`${fullScreenMode ? 'flex-1 overflow-y-auto' : 'absolute top-full left-0 w-full'} bg-white border border-green-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto ${!fullScreenMode && 'mt-1'}`}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleProfileClick(user._id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profilePicture} alt="profile" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <h1 className="text-sm font-medium">{user?.fullName}</h1>
                      <RoleBadge role={user?.role} className="text-xs" />
                    </div>
                    <p className="text-xs text-gray-600 font-semibold">
                      {user?.department || "Dept. not defined"}
                    </p>
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
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;