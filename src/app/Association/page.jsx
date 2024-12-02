import Sidebar from '@/components/sidebar/SAsidebar';
import Header from '@/components/headers/SAheader';
import SABanner from '@/components/SAbanner';
import AMemberlist from '@/components/memberlists/Amemberlist'; 
import React from 'react';

const members = () => {
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 overflow-y-auto">
        <Header />
        <SABanner />
        <AMemberlist /> 
      </div>
    </div>
  );
};

export default members;