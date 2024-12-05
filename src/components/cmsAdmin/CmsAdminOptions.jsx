import React from 'react'
import { IoMdAddCircle } from "react-icons/io";
import { MdPreview } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
import { useRouter } from 'next/navigation';

const CmsAdminOptions = () => {
    const router = useRouter();

    const handleAddSponsor = () => {
        router.push('/cms-admin/sponsors/add-sponsors');
    };
    const handleViewSponsor = () => {
        router.push('/cms-admin/sponsors/view-sponsors');
    };
    const handleHomeSponsor = () => {
        router.push('/cms-admin/sponsors/home-sponsors');
    };
    const handlePopupSponsor = () => {
        router.push('/cms-admin/sponsors/popup-sponsor');
    };
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
      {/* Associate Admin */}
      <div
      onClick = {handleAddSponsor}
       className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
        <IoMdAddCircle  size={48} />
        <h2 className="text-xl mt-4">Add Sponsors</h2>
        <p className="text-4xl font-bold mt-2"></p>
      </div>

      {/* Association Members */}
      <div
      onClick={handleViewSponsor} 
      className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
        <MdPreview size={48} />
        <h2 className="text-xl mt-4">View All Sponsors</h2>
        <p className="text-4xl font-bold mt-2"></p>
      </div>

      {/* Vendors */}
      <div
      onClick={handleHomeSponsor}
       className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
        <FaHome size={48} />
        <h2 className="text-xl mt-4">Home Page Sponsors</h2>
        <p className="text-4xl font-bold mt-2"></p>
      </div>

      {/* Pending Members */}
      <div
      onClick={handlePopupSponsor}
       className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center hover:bg-white hover:text-blue-500">
        <MdEventAvailable size={48} />
        <h2 className="text-xl mt-4">Event Pop-up Sponsor</h2>
        <p className="text-4xl font-bold mt-2"></p>
      </div>
    </div>
  </>
);
};

export default CmsAdminOptions;