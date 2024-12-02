import SASidebar from "@/components/sidebar/SAsidebar";
import SAHeader from "@/components/headers/SAheader";
import SABanner from "@/components/SAbanner";
import Vmemberlist from "@/components/memberlists/Vmemberlist";
import React from "react";

const members = () => {
  return (
    <div className="flex bg-white min-h-screen">
     <SASidebar/>
      <div className="flex-1 p-4 overflow-y-auto">
        <SAHeader />
        <SABanner />
        <Vmemberlist />
      </div>
    </div>
  );
};

export default members;