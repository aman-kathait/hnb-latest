import React from 'react'
import { useSelector } from 'react-redux'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <aside className="hidden md:block md:w-64 lg:w-72 xl:w-80 mt-16 pr-6">
      <div className="w-full max-w-xs">
        <SuggestedUsers />
      </div>
    </aside>
  )
}

export default RightSidebar;
