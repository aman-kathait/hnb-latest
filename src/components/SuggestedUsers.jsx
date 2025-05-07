import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import RoleBadge from "./RoleBadge"
import useFollowUser from '@/hooks/useFollowUser'
import { toast } from 'sonner'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const SuggestedUsers = () => {
  const dispatch = useDispatch()
  const { suggestedUsers = [], user = {},userProfiles=[] } = useSelector(store => store.auth || {})
  
  const { followOrUnfollow } = useFollowUser()
  const [loadingStates, setLoadingStates] = useState({})

  useEffect(() => {
    console.log("Fetched user profiles from Redux new hook:", userProfiles);
  }, [userProfiles]);
  
  // Check if current user is following a suggested user
  const isFollowing = (userId) => {
    return user?.following?.some(id => 
      id === userId || (typeof id === 'object' && id._id === userId)
    );
  }
  
  // Handle follow/unfollow action
  const handleFollow = async (userId) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }))
    
    try {
      const res = await followOrUnfollow(userId)
      
      // Success message based on follow state
      const successMessage = isFollowing(userId) 
        ? "Successfully unfollowed user" 
        : "Successfully followed user";
      toast.success(successMessage)
      
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error)
      toast.error(error.response?.data?.message || "Failed to update follow status")
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }))
    }
  }

  return (
    <div className='my-6 bg-[#F4FFF6] rounded-2xl h-100'>
      <div className='mx-8 flex items-center justify-between text-sm w-70 rounded-2xl'>
        <h1 className='text-lg font-semibold text-[#1D5C3B] mt-2'>Suggested for you</h1>
      </div>

      <div className='mx-6'>
        {suggestedUsers.length === 0 ? (
          <p className='text-sm text-gray-500 mt-4'>No suggestions available.</p>
        ) : (
          suggestedUsers.slice(0, 4).map((suggestedUser) => (
            <div key={suggestedUser._id} className='flex items-center justify-between my-5 p-2 border rounded-xl'>
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${suggestedUser?._id}`}>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={suggestedUser?.profilePicture} alt="profile" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div className='flex flex-col'>
                  <div className='flex items-center gap-1'>
                    <h1 className='text-sm font-semibold text-[#1D5C3B]'>
                      <Link to={`/profile/${suggestedUser?._id}`}>{suggestedUser?.fullName}</Link>
                    </h1>
                    <RoleBadge role={suggestedUser?.role} className="text-xs" />
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">
                    {suggestedUser?.department || "Dept. not defined"}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => handleFollow(suggestedUser._id)}
                disabled={loadingStates[suggestedUser._id]}
                className={`text-xs font-bold cursor-pointer p-1 rounded-lg px-2 border transition disabled:opacity-50 ${
                  isFollowing(suggestedUser._id) 
                    ? 'text-gray-600 border-gray-500 hover:bg-gray-100' 
                    : 'text-[#1D5C3B] border-[#1D5C3B] hover:bg-[#eefff3] hover:text-[#3495d6]'
                }`}
              >
                {loadingStates[suggestedUser._id] 
                  ? 'Loading...' 
                  : isFollowing(suggestedUser._id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SuggestedUsers
