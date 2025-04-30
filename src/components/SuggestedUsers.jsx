import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    // Safely access suggestedUsers with a fallback
    const { suggestedUsers = [] } = useSelector(store => store.auth || {});

    return (
        <div className='my-6 bg-[#F4FFF6] rounded-2xl h-100'>
            <div className='mx-8 flex items-center justify-between text-sm w-64 rounded-2xl'>
                <h1 className='text-lg font-semibold text-[#1D5C3B] mt-2 '>Suggested for you</h1>
            </div>
            <div className='mx-6 '>
            {suggestedUsers.length === 0 ? (
                <p className='text-sm text-gray-500 mt-4'>No suggestions available.</p>
            ) : (

                suggestedUsers.slice(0,4).map((user) => (
                    <div key={user._id} className='flex items-center justify-between my-5 p-2 border rounded-xl'>
                        <div className='flex items-center gap-2'>
                            <Link to={`/profile/${user?._id}`}>
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user?.profilePicture} alt="profile" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div>
                                <h1 className='text-base font-medium'>
                                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                </h1>
                                <span className='text-gray-600 text-sm font-semibold'>{user?.department || 'Computer'}</span>
                            </div>
                        </div>
                        <span className='text-[#1D5C3B] text-xs font-bold cursor-pointer hover:text-[#3495d6] p-1 rounded-lg px-2 border border-[#1D5C3B]'>Follow</span>
                    </div>
                ))
            )} 
            </div>
            
        </div>
    )
}

export default SuggestedUsers;
