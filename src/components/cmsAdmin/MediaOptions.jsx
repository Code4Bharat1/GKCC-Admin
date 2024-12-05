import React from 'react'
import { IoImages } from "react-icons/io5";
import { LiaVideoSolid } from "react-icons/lia";
import { useRouter } from 'next/navigation';

const MediaOptions = () => {
  const router = useRouter();

  const handleAddImage = () => {
      router.push('/cms-admin/media/add-images');
  };
  const handleAddVideo = () => {
      router.push('/cms-admin/media/add-videos');
  };
  
return (
  <>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 p-6">
    {/* Associate Admin */}
    <div
    onClick = {handleAddImage}
     className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
      <IoImages  size={48} />
      <h2 className="text-xl mt-4">Add Images</h2>
      <p className="text-4xl font-bold mt-2"></p>
    </div>

    {/* Association Members */}
    <div
    onClick={handleAddVideo} 
    className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
      <LiaVideoSolid size={48} />
      <h2 className="text-xl mt-4">Add Videos</h2>
      <p className="text-4xl font-bold mt-2"></p>
    </div>

    
  </div>
</>
);
};

export default MediaOptions;