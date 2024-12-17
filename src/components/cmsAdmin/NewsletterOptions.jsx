import React from 'react'
import { IoIosAddCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { IoMdArchive } from "react-icons/io";
import { useRouter } from 'next/navigation';

const NewsletterOptions = () => {
  const router = useRouter();

  const handleCreateNewsletter = () => {
      router.push('/cms-admin/newsletter/create-newsletter');
  };
  const handleEditNewsletter = () => {
      router.push('/cms-admin/newsletter/edit-newsletter');
  };
  const handleViewArchive = () => {
      router.push('/cms-admin/newsletter/archive-newsletter');
  };
return (
  <>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">

    <div
    onClick = {handleCreateNewsletter}
     className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
      <IoIosAddCircle  size={48} />
      <h2 className="text-xl mt-4">Create Newsletter</h2>
      <p className="text-4xl font-bold mt-2"></p>
    </div>

 
    <div
    onClick={handleEditNewsletter} 
    className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
      <FaRegEdit size={48} />
      <h2 className="text-xl mt-4">Edit Existing Newsletter</h2>
      <p className="text-4xl font-bold mt-2"></p>
    </div>

    <div
    onClick={handleViewArchive} 
    className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
      <IoMdArchive size={48} />
      <h2 className="text-xl mt-4">Archived Newsletters</h2>
      <p className="text-4xl font-bold mt-2"></p>
    </div>

    
  </div>
</>
);
};

export default NewsletterOptions;



