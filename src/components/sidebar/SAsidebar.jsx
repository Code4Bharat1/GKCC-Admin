"use client"
import React from 'react';
import { FaUser, FaUsers, FaFileInvoice, FaRegCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';

const SASidebar = () => {
  const router = useRouter(); 

  const handleLogoClick = () => {
    router.push('/landingSA'); // Update this to the correct landing page
  };

  const handleMemberListClick = () => {
    router.push('/SAmembers'); 
  };  

  const handleVendorsClick = () => {
    router.push('/vendors'); 
  };  

  const handleAssociationClick = () => {
    router.push('/Association'); 
  };

  const handleLogoutClick = async () => {
    try {
      
      localStorage.removeItem('token'); 
      // Redirect to the login page
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally handle the error, show a message, etc.
    }
  };

  return (
    <div className="flex flex-col text-white bg-blue-500 ml-8 mt-34 p-4 w-full rounded-lg sm:w-56"> 
      {/* Clickable logo */}
      <div className="flex justify-center mb-10 cursor-pointer" onClick={handleLogoClick}>
        <img 
          src="/gkcc.png" // Update with the correct logo path
          alt="Logo" 
          className="h-40  w-48 object-contain rounded-lg" // Adjust height and width as needed
        />
      </div>
      
      <div className="flex items-center mt-8 mb-6 cursor-pointer backdrop-blur-md bg-white text-black  p-3 rounded hover:bg-blue-800 transition" onClick={handleAssociationClick}> 
        <FaUser className="text-2xl" />
        <span className="ml-4 sm:ml-8">Associate Admin</span>
      </div>
      
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition" onClick={handleMemberListClick}> 
        <FaUsers className="text-2xl" />
        <span className="ml-4 sm:ml-8">Member List</span>
      </div>

      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition" onClick={handleVendorsClick}> 
        <FaUsers className="text-2xl" />
        <span className="ml-4 sm:ml-8">Vendors</span>
      </div>
      
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition"> 
        <FaFileInvoice className="text-2xl" />
        <span className="ml-4 sm:ml-8">Transactions</span>
      </div>
      
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition"> 
        <FaRegCalendarAlt className="text-2xl" />
        <span className="ml-4 sm:ml-8">Events</span>
      </div>

      {/* Logout Button */}
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-red-600 transition" onClick={handleLogoutClick}> 
        <FaSignOutAlt className="text-2xl" />
        <span className="ml-4 sm:ml-8">Logout</span>
      </div>
    </div>
  );
};

export default SASidebar;
