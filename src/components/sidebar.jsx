"use client"
import React from 'react';
import { FaHome, FaUser, FaUsers, FaFileInvoice, FaRegCalendarAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; 

const Sidebar = () => {
  const router = useRouter(); 

  const handleMemberListClick = () => {
    router.push('/members'); 
  };

  return (
    <div className="flex flex-col text-white ml-8 mt-36 p-4 w-full sm:w-56"> 
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-gray-800 bg-opacity-50 p-3 rounded hover:bg-blue-800 transition"> 
        <FaUsers className="text-2xl" />
        <span className="ml-4 sm:ml-8">Contury Admin</span>
      </div>
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-gray-800 bg-opacity-50 p-3 rounded hover:bg-blue-800 transition"> 
        <FaUser className="text-2xl" />
        <span className="ml-4 sm:ml-8">Associate Admin</span>
      </div>
      <div 
        className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-gray-800 bg-opacity-50 p-3 rounded hover:bg-blue-800 transition" 
        onClick={handleMemberListClick} 
      >
        <FaUsers className="text-2xl" />
        <span className="ml-4 sm:ml-8">Member List</span>
      </div>
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-gray-800 bg-opacity-50 p-3 rounded hover:bg-blue-800 transition"> 
        <FaFileInvoice className="text-2xl" />
        <span className="ml-4 sm:ml-8">Transactions</span>
      </div>
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-gray-800 bg-opacity-50 p-3 rounded hover:bg-blue-800 transition"> 
        <FaRegCalendarAlt className="text-2xl" />
        <span className="ml-4 sm:ml-8">Events</span>
      </div>
    </div>
  );
};

export default Sidebar;
