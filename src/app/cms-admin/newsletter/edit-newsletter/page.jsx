"use client"
import React from 'react';
import CmsAdminSidebar from '@/components/cmsAdmin/CmsAdminSidebar'
import CmsAdminHeader from '@/components/cmsAdmin/CmsAdminHeader';
import NewsletterOptions from '@/components/cmsAdmin/NewsletterOptions';
import EditNewsletter from '@/components/cmsAdmin/EditNewsletter';


const page = () => {


  return (
<div className="flex bg-white min-h-screen">
  <CmsAdminSidebar/>
  <div className="flex-1 p-4 overflow-y-auto">
  <CmsAdminHeader/>
 <NewsletterOptions/>
 <EditNewsletter/>
 </div>
 </div>
  )
}

export default page;