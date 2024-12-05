"use client"
import React from 'react';
import CmsAdminSidebar from '@/components/cmsAdmin/CmsAdminSidebar'
import CmsAdminHeader from '@/components/cmsAdmin/CmsAdminHeader';
import CmsAdminOptions from '@/components/cmsAdmin/CmsAdminOptions';
import HomeSponsor from '@/components/cmsAdmin/HomeSponsor';
const page = () => {


  return (
<div className="flex bg-white min-h-screen">
  <CmsAdminSidebar/>
  <div className="flex-1 p-4 overflow-y-auto">
  <CmsAdminHeader/>
  <CmsAdminOptions/>
  <HomeSponsor/>
  
  
 </div>
 </div>
  )
}

export default page;