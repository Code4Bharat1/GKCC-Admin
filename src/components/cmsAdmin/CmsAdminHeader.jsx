import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
const CmsAdminHeader = () => {
 
  const userName = "Cms Admin"; 

  return (
    <header className="flex justify-between items-center ml-1 mr-8 p-5 bg-blue-500 border-b border-black-300 rounded-lg w-full h-28">
     

      <div className="flex items-center ml-auto  "> 
        <div className="relative cursor-pointer mr-10 "> 
           </div>
        <div className="flex items-center mr-8 border cursor-pointer">
          <FaUserCircle className="text-white text-4xl" /> 
          <span className="ml-2 text-white">{userName}</span> 
        </div>
      </div>
    </header>
  );
};

export default CmsAdminHeader;

