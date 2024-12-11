import React from 'react'
import { IoIosAddCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';


const VideoAlbumsOption = () => {
    const router = useRouter();

    const handleCreateAlbum = () => {
        router.push('/cms-admin/media/create-videos-album');
    };
    const handleEditAlbum = () => {
        router.push('/cms-admin/media/edit-videos-album');
    };
    
  return (
    <>
    <h1 className='text-5xl text-blue-500 text-center font-semibold'>Add Videos</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-6">
      {/* Associate Admin */}
      <div
      onClick = {handleCreateAlbum}
       className=" w-72 md:ml-56 bg-green-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-green-500">
        <IoIosAddCircle  size={48} />
        <h2 className="text-xl mt-4">Create Albums</h2>
        <p className="text-4xl font-bold mt-2"></p>
      </div>
  
      {/* Association Members */}
      <div
      onClick={handleEditAlbum} 
      className="w-72 md:ml-12 bg-yellow-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-yellow-500">
        <FaRegEdit size={48} />
        <h2 className="text-xl mt-4">Edit Existing Albums</h2>
        <p className="text-4xl font-bold mt-2"></p>
      </div>
  
      
    </div>
  </>
  );
  };
  

export default VideoAlbumsOption;