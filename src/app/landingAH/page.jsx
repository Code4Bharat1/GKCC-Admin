import AHSidebar from '@/components/sidebar/AHsidebar';
import AHHeader from '@/components/headers/AHheader';
import AHBanner from '@/components/AHbanner';
// import Memberlist from '@/components/MemberList'; 

import React from 'react';


const members = () => {
  return (
    <div className="flex bg-white min-h-screen">
      <AHSidebar />
      <div className="flex-1 p-4 overflow-y-auto">
        <AHHeader />
       <AHBanner/>
        
      </div>
    </div>
  );
};

export default members;