import React from 'react';
import { useSelector } from 'react-redux';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <aside className="hidden md:block fixed right-0 top-16 w-64 lg:w-72 xl:w-80 p-4 overflow-y-auto max-h-[calc(100vh-4rem)] bg-white shadow-sm border-l">
      <div className="w-full">
        <SuggestedUsers />
      </div>
    </aside>
  );
};

export default RightSidebar;
