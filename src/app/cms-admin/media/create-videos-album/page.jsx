"use client"
import React from 'react'
import CmsAdminSidebar from '@/components/cmsAdmin/CmsAdminSidebar';
import CmsAdminHeader from '@/components/cmsAdmin/CmsAdminHeader';
import MediaOptions from '@/components/cmsAdmin/MediaOptions';
import VideoAlbumsOption from '@/components/cmsAdmin/VideoAlbumsOption';
import CreateVideosAlbums from '@/components/cmsAdmin/CreateVideosAlbums';
const page = () => {
  return (
<div className="flex bg-white min-h-screen">
  <CmsAdminSidebar/>
  <div className="flex-1 p-4 overflow-y-auto">
  <CmsAdminHeader/>
  <MediaOptions/>
  <VideoAlbumsOption/>
  <CreateVideosAlbums/>

 </div>
 </div>
  )
}

export default page;