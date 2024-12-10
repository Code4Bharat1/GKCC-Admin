import React from 'react'
import { IoIosAddCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const NewsletterOptions = () => {
  const router = useRouter();

  const handleAddImage = () => {
      router.push('/cms-admin/newsletter/create-newsletter');
  };
  const handleAddVideo = () => {
      router.push('/cms-admin/newsletter/edit-newsletter');
  };
  
return (
  <>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 p-6">
    {/* Associate Admin */}
    <div
    onClick = {handleAddImage}
     className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
      <IoIosAddCircle  size={48} />
      <h2 className="text-xl mt-4">Create Newsletter</h2>
      <p className="text-4xl font-bold mt-2"></p>
    </div>

    {/* Association Members */}
    <div
    onClick={handleAddVideo} 
    className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
      <FaRegEdit size={48} />
      <h2 className="text-xl mt-4">Edit Existing Newsletter</h2>
      <p className="text-4xl font-bold mt-2"></p>
    </div>

    
  </div>
</>
);
};

export default NewsletterOptions;



