import SASidebar from "@/components/sidebar/SAsidebar";
import SAHeader from "@/components/headers/SAheader";
import SABanner from "@/components/SAbanner";
import Memberlist from "@/components/memberlists/SAmemberlist";
import React from "react";

const members = () => {
  return (
    <div className="flex bg-white min-h-screen">
     <SASidebar/>
      <div className="flex-1 p-4 overflow-y-auto">
        <SAHeader />
        <SABanner />
        <Memberlist />
      </div>
    </div>
  );
};

export default members;
