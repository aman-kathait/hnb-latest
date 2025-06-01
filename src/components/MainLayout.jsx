import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import SuggestedUsers from './SuggestedUsers'; // used in RightSidebar inline

const MainLayout = () => {
  return (
    <div className="bg-[#F5F9F5] min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex pt-16">
        {/* Fixed Left Sidebar */}
        <div className="hidden md:block fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-white shadow-sm z-10">
          <LeftSidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 md:px-8 lg:px-16 xl:px-20 mx-auto md:ml-64 lg:mr-72">
          <div className="max-w-3xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Fixed Right Sidebar */}
        <div className="hidden lg:block fixed top-16 right-0 w-72 xl:w-80 h-[calc(100vh-4rem)] overflow-y-auto border-l bg-white shadow-sm p-4 z-10">
          <SuggestedUsers />
        </div>
      </div>

      {/* Footer (Optional: adjust margin if needed) */}
      <Footer />
    </div>
  );
};

export default MainLayout;
