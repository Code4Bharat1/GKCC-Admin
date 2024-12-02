"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import xlsx library
import { FaDownload } from "react-icons/fa"; // Import FaDownload icon

const AHMemberList = () => {
  const [filter, setFilter] = useState("pending"); // Default to 'pending' to show pending members first
  const [members, setMembers] = useState([]);
  const [headers, setHeaders] = useState([]); // State for headers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null); // State to manage the selected member for the modal

  useEffect(() => {
    // Fetching member data from the backend
    const fetchMembers = async () => {
      const token = localStorage.getItem("token"); // Assuming you are using token-based authentication
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getpendinglist`; // Update with the correct API endpoint
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const pendingMembers = response.data.message || []; // Adjust this based on your API response structure
        setMembers(pendingMembers);

        // Fetch headers
        const headerResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getheaders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHeaders(headerResponse.data.headers); // Assuming the headers are in `headerResponse.data.headers`
      } catch (err) {
        console.error(err);
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
      } finally {
        setLoading(false); // Ensure loading state is updated regardless of success or failure
      }
    };

    fetchMembers();
  }, []); // Fetch data only once when the component mounts

  // Handle Accepting a member
  const handleAccept = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/approve/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(members.filter((member) => member._id !== memberId));
      setSelectedMember(null); // Close the modal if it's open
    } catch (err) {
      console.error("Error accepting member:", err);
    }
  };

  // Handle Rejecting a member
  const handleReject = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/reject/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembers(members.filter((member) => member._id !== memberId));
      setSelectedMember(null); // Close the modal if it's open
    } catch (err) {
      console.error("Error rejecting member:", err);
    }
  };

  // Handle Downloading the Filtered Members List as Excel
  const handleDownload = () => {
    // Filter members based on the selected filter
    const filteredMembers = members.filter((member) => {
      if (filter === "pending") return member.status === "pending";
      if (filter === "allowed") return member.status === "allowed";
      if (filter === "rejected") return member.status === "rejected";
      return false; // Default case (should not happen)
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredMembers, {
      header: headers, // Use fetched headers
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Members");
    XLSX.writeFile(workbook, `FilteredMembers_${filter}.xlsx`); // Filename includes the filter
  };

  // Function to accept uploaded members
  const acceptUploadedMembers = (uploadedMembers) => {
    setMembers((prevMembers) => [...prevMembers, ...uploadedMembers]);
  };

  if (loading)
    return (
      <div className="text-white" aria-live="polite">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500" aria-live="assertive">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col p-4 bg-blue-500 text-white rounded-lg">
      <h2 className="text-2xl font-bold mt-8">Association List</h2>

      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-4 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center"
          onClick={handleDownload}
        >
          <FaDownload className="mr-4 ml-4 text-2xl" />
          Download {filter.charAt(0).toUpperCase() + filter.slice(1)} List
        </button>
      </div>

      <div className="flex justify-between mb-2">
        <button
          className={`px-4 py-2 rounded ${
            filter === "allowed" ? "bg-blue-800" : "bg-white text-black"
          }`}
          onClick={() => setFilter("allowed")}
        >
          Accepted
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "pending" ? "bg-blue-800" : "bg-white text-black"
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "rejected" ? "bg-blue-800" : "bg-white text-black"
          }`}
          onClick={() => setFilter("rejected")}
        >
          Rejected
        </button>
      </div>

      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left">SR</th>
            <th className="px-4 py-2 text-left">NAME</th>
            <th className="px-4 py-2 text-left">COUNTRY</th>
            <th className="px-4 py-2 text-left">ROLE</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member, index) => (
              <tr key={member._id} className="border-b hover:bg-gray-700">
                <td className="px-4 py-2">#{index + 1}</td>
                <td className="px-4 py-2">
                  {member.firstName} {member.middleName} {member.familyName}
                </td>
                <td className="px-4 py-2">{member.internationalCountry}</td>
                <td className="px-4 py-2">{member.role || "N/A"}</td>
                <td className="px-4 py-2">
                  {filter === "pending" && (
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  )}
                  {filter === "allowed" && (
                    <span className="text-green-500">Allowed</span>
                  )}
                  {filter === "rejected" && (
                    <span className="text-red-500">Rejected</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-2">
                No members found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Selected Member Profile */}
      {selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSelectedMember(null)}
          ></div>
          <div className="bg-white text-black rounded-lg overflow-y-auto max-h-screen w-full max-w-2xl p-6 relative z-10">
            <h3 className="text-xl font-bold mb-4">
              {selectedMember.firstName} {selectedMember.middleName}{" "}
              {selectedMember.familyName}&apos;s Profile
            </h3>
            <div className="space-y-2">
              {headers.map((header) => (
                <p key={header}>
                  <strong>{header.charAt(0).toUpperCase() + header.slice(1)}:</strong>{" "}
                  {selectedMember[header] || "N/A"}
                </p>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => handleAccept(selectedMember._id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(selectedMember._id)}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AHMemberList;
