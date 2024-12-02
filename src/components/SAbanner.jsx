"use client";

import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaUsers,
  FaStore,
  FaHourglassHalf,
} from "react-icons/fa"; // Updated icons for better representation
import axios from "axios"; // For making requests to the backend

const SABanner = () => {
  const [data, setData] = useState({
    associateAdmin: 0,
    associationMembers: 0,
    vendors: 0,
    pendingMembers: 0,
  });

  const [loading, setLoading] = useState(true);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      // Make all API requests in parallel
      const [
        memberCountResponse,
        pendingMemberCountResponse,
        vendorCountResponse,
        associationCountResponse,
      ] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/member/getmembercount`
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/member/getpendingmembercount`
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/vendor/getVendorcount`
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getAssociationcount`
        ),
      ]);
      console.log(
        memberCountResponse,
        pendingMemberCountResponse,
        vendorCountResponse,
        associationCountResponse
      );

      // Assuming each response has a 'count' field
      setData({
        associateAdmin:
          associationCountResponse.data.data.totalAssociations || 0,
        associationMembers: memberCountResponse.data.data.totalMember || 0,
        vendors: vendorCountResponse.data.data.Vendor || 0,
        pendingMembers: pendingMemberCountResponse.data.data.pendingcount || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-center text-2xl flex justify-center items-center h-full p-6">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 p-6">
        {/* Associate Admin */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaUserCircle size={48} />
          <h2 className="text-xl mt-4">Associate Admin</h2>
          <p className="text-4xl font-bold mt-2">{data.associateAdmin}</p>
        </div>

        {/* Association Members */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaUsers size={48} />
          <h2 className="text-xl mt-4">Association Members</h2>
          <p className="text-4xl font-bold mt-2">{data.associationMembers}</p>
        </div>

        {/* Vendors */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaStore size={48} />
          <h2 className="text-xl mt-4">Vendors</h2>
          <p className="text-4xl font-bold mt-2">{data.vendors}</p>
        </div>

        {/* Pending Members */}
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <FaHourglassHalf size={48} />
          <h2 className="text-xl mt-4">Pending Members</h2>
          <p className="text-4xl font-bold mt-2">{data.pendingMembers}</p>
        </div>
      </div>
    </>
  );
};

export default SABanner;
