import React, { use } from 'react'
import { Outlet } from 'react-router-dom'
import useGetAllPost from '@/hooks/getAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import useGetUserProfiles from '@/hooks/useGetUserProfiles'
const Home = () => {
  useGetAllPost();
  
  useGetSuggestedUsers();
  useGetUserProfiles();
  return (
    <div >
            <div >
                <Outlet />
            </div>
        </div>
  )
}

export default Home;