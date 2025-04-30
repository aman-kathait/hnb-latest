import React from 'react'
import { Avatar,AvatarFallback,AvatarImage } from './ui/avatar'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
const Footer = () => {
  const footerHandler = (textType) => {
    if (textType === 'Logout') {
        logoutHandler();
    } else if (textType === "Create") {
        setOpen(true);
    } else if (textType === "Profile") {
        navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
        navigate("/");
    } else if (textType === 'Messages') {
        navigate("/chat");
    }
  }
  const footerItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <PlusSquare />, text: "Create" },
    { icon: <TrendingUp />, text: "Explore" },
    {
        icon: (
            <Avatar className='w-7 h-7'>
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
        text: "Profile"
    },
  ]
  return (
    <div className='sm:hidden w-full h-16 fixed bottom-0 left-0 flex justify-center items-center bg-white shadow-sm border-t-1 z-50'>
      <div className='flex justify-around items-center w-full h-full'>
        {footerItems.map((item, index) => {
          return (
            <div
              onClick={() => footerHandler(item.text)}
              key={index}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              {item.icon}
              {/* <span>{item.text}</span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Footer