import React, { use } from 'react'
import { Outlet } from 'react-router-dom'
import Feed from './Feed'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/getAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import useGetUserProfiles from '@/hooks/useGetUserProfiles'
const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  useGetUserProfiles();
  return (
    <div className='flex'>
            <div className='flex-grow'>
                <Outlet />
            </div>
            <RightSidebar/>
        </div>
  )
}

export default Home;