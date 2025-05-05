import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import Navbar from './Navbar'
import Footer from './Footer'
const MainLayout = () => {
  return (
    <div className='bg-[#F5F9F5]'>
      <Navbar/>
      <div className="flex">
      <LeftSidebar/>
        <div className="flex-1">
          <Outlet/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayout;