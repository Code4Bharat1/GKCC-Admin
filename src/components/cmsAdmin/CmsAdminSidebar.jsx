"use client"
import React from 'react';
import { FcCollaboration } from "react-icons/fc";
import { FaSignOutAlt } from "react-icons/fa"
import { MdPermMedia } from "react-icons/md";
import { useRouter } from 'next/navigation'; 
import { IoNewspaperOutline } from "react-icons/io5";


const CmsAdminSidebar = () => {
  const router = useRouter(); 

  const handleLogoClick = () => {
    router.push('/cms-admin'); // Update this to the correct landing page
  };

  const handleMedia = () => {
    router.push('/cms-admin/media'); 
  };  

  const handleNewsletter = () => {
    router.push('/cms-admin/newsletter'); 
  };  

  const handleSponsors = () => {
    router.push('/cms-admin/sponsors'); 
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
      
      <div className="flex items-center mt-8 mb-6 cursor-pointer backdrop-blur-md bg-white text-black  p-3 rounded hover:bg-blue-800 transition" onClick={handleSponsors}> 
        <FcCollaboration className="text-2xl" />
        <span className="ml-4 sm:ml-8">Sponsors</span>
      </div>
      
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition" onClick={handleMedia}> 
        <MdPermMedia className="text-2xl" />
        <span className="ml-4 sm:ml-8">Media</span>
      </div>

      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition" onClick={handleNewsletter}> 
        <IoNewspaperOutline className="text-2xl" />
        <span className="ml-4 sm:ml-8">Newsletter</span>
      </div>
      
      

      {/* Logout Button */}
      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-red-600 transition" onClick={handleLogoutClick}> 
        <FaSignOutAlt className="text-2xl" />
        <span className="ml-4 sm:ml-8">Logout</span>
      </div>
    </div>
  );
};

export default CmsAdminSidebar;
