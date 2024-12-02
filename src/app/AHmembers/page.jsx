import Sidebar from '@/components/sidebar/AHsidebar';
import AHHeader from '@/components/headers/AHheader';
import AHBanner from '@/components/AHbanner';
import AHMemberlist from '@/components/memberlists/AHmemberlist'; 
import React from 'react';

const members = () => {  
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 overflow-y-auto">
        <AHHeader />
        <AHBanner />
        <AHMemberlist /> 
      </div>
    </div>
  );
};

export default members;