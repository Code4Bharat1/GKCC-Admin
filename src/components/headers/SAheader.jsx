import React from 'react';
import Image from 'next/image';
import { FaBell, FaUserCircle } from 'react-icons/fa'; // Importing notification and user icons

const SAHeader = () => {
  const unreadNotifications = 3; // Example count of unread notifications
  const userName = "Super Admin"; 

  return (
    <header className="flex justify-between items-center ml-1 p-5 bg-blue-500 border-b border-black-300 rounded-lg w-full h-28">
     

      <div className="flex items-center ml-auto  "> 
        <div className="relative cursor-pointer mr-10 "> 
          <FaBell className="text-white text-4xl " />

          {unreadNotifications > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </div>

        
        <div className="flex items-center cursor-pointer">
          <FaUserCircle className="text-white text-4xl" /> 
          <span className="ml-2 text-white">{userName}</span> 
        </div>
      </div>
    </header>
  );
};

export default SAHeader;

