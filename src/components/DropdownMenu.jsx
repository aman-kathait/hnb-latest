import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageCircle, User, LogOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import SearchBar from "./SearchBar";

const DropdownMenu = ({ onClose }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showFullScreenSearch, setShowFullScreenSearch] = useState(false);
  const searchInputRef = useRef(null);

  // Focus the input when fullscreen search opens
  useEffect(() => {
    if (showFullScreenSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showFullScreenSearch]);

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

  const handleSearchClick = () => {
    setShowFullScreenSearch(true);
    onClose(); // Close the dropdown menu
  };

  const handleSearchComplete = () => {
    setShowFullScreenSearch(false); // Hide search when complete
  };

  const closeFullScreenSearch = () => {
    setShowFullScreenSearch(false);
  };

  return (
    <>
      {/* Full-screen search overlay */}
      {showFullScreenSearch && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Search header with close button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex-1 max-w-3xl mx-auto">
              <SearchBar 
                inputRef={searchInputRef}
                onSearchComplete={handleSearchComplete}
                fullScreenMode={true}
              />
            </div>
            <button 
              onClick={closeFullScreenSearch}
              className="ml-4 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close search"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          {/* Search results container */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Your search results component would go here */}
            {/* Example: <SearchResults onResultClick={handleSearchComplete} /> */}
          </div>
        </div>
      )}

      {/* Original dropdown menu */}
      <div className="bg-white shadow-lg rounded-lg p-4 space-y-3 text-gray-800 w-64">
        <button
          onClick={handleSearchClick}
          className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded w-full"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>

        <Link
          to="/chat"
          onClick={onClose}
          className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Messages</span>
        </Link>

        <Link
          to={`/profile/${user?._id}`}
          onClick={onClose}
          className="flex items-center gap-2 hover:bg-gray-100 px-2 py-2 rounded"
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>

        <button
          onClick={logoutHandler}
          className="flex items-center gap-2 hover:bg-red-50 text-red-600 px-2 py-2 rounded w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default DropdownMenu;