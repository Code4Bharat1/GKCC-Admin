"use client";

import React, { useEffect, useState } from "react";
import axios from "axios"; // Axios for HTTP requests
import {
  FaUserCircle,
  FaUsers,
  FaStore,
  FaHourglassHalf,
} from "react-icons/fa"; // Optional: Icons for better representation
import Loader from "./loader/Loader";

const AHBanner = () => {
  // State to hold counts
  const [data, setData] = useState({
    associationMembers: 0,
    pendingMembers: 0,
  });

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from the backend
  const fetchData = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      // Configure Axios headers with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Make concurrent API requests
      const [associationMembersResponse, pendingMembersResponse] =
        await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/member/thisAssociationTotalCount`,
            config
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/member/thisAssociationPendingCount`,
            config
          ),
        ]);

      // Assuming each response has a 'count' property
      setData({
        associationMembers: associationMembersResponse.data.data || 0,
        pendingMembers: pendingMembersResponse.data.data || 0,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      // Set a user-friendly error message
      setError(
        err.response?.data?.message || "An error occurred while fetching data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Optionally, you can set up polling or intervals here
  }, []);

  // Conditional rendering based on loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40 text-white text-2xl p-4">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-40 bg-red-500 text-white text-2xl p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 p-6">
      {/* Association Members Card */}
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center transition transform hover:scale-105 duration-300">
        <FaUsers size={48} className="mb-4" />
        <h2 className="text-xl font-semibold">Association Members</h2>
        <p className="text-4xl font-bold mt-2">{data.associationMembers}</p>
      </div>

      {/* Pending Members Card */}
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex flex-col items-center transition transform hover:scale-105 duration-300">
        <FaHourglassHalf size={48} className="mb-4" />
        <h2 className="text-xl font-semibold">Pending Members</h2>
        <p className="text-4xl font-bold mt-2">{data.pendingMembers}</p>
      </div>
    </div>
  );
};

export default AHBanner;
