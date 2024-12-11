"use client"
import React from 'react'
import CmsAdminSidebar from '@/components/cmsAdmin/CmsAdminSidebar';
import CmsAdminHeader from '@/components/cmsAdmin/CmsAdminHeader';
import MediaOptions from '@/components/cmsAdmin/MediaOptions';
import AlbumsOption from '@/components/cmsAdmin/AlbumsOption';
import EditAlbums from '@/components/cmsAdmin/EditAlbums';
const page = () => {
  return (
<div className="flex bg-white min-h-screen">
  <CmsAdminSidebar/>
  <div className="flex-1 p-4 overflow-y-auto">
  <CmsAdminHeader/>
  <MediaOptions/>
  <AlbumsOption/>
  <EditAlbums/>
 </div>
 </div>
 
  )
}

export default page;