"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const SAMemberList = () => {
  const [filter, setFilter] = useState("pending"); // Default to 'pending' to show pending members first
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null); // New state to manage the selected member for the modal

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      // console.log(token);
      
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        let url;
        if (filter === "pending") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getSApendinglist`;
        } else if (filter === "allowed") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getSAacceptedlist`;
        } else if (filter === "rejected") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getSARejectedlist`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          const memberData = response.data.message || [];
          setMembers(Array.isArray(memberData) ? memberData : []);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMembers();
    return () => {
      isMounted = false;
    };
  }, [filter]); // Refetch the data whenever the filter changes

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

      // Remove the accepted member from the list
      setMembers(members.filter((member) => member._id !== memberId));

      // Close the modal if it's open
      setSelectedMember(null);
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
      // Remove the rejected member from the list
      setMembers(members.filter((member) => member._id !== memberId));

      // Close the modal if it's open
      setSelectedMember(null);
    } catch (err) {
      console.error("Error rejecting member:", err);
    }
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
    <div className="flex flex-col p-4 bg-blue-500 text-white mt-6 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Member List</h2>

      <div className="flex justify-between mb-4">
        <button
          className={`px-4 py-2 rounded ${
            filter === "allowed" ? "bg-blue-800" : "bg-white text-black"
          }`}
          onClick={() => setFilter("allowed")}
        >
          Allowed
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
                <td className="px-4 py-2">
                  {member.nationality || member.internationalCountry}
                </td>
                <td className="px-4 py-2">{member.role || "N/A"}</td>
                <td className="px-4 py-2">
                  {filter === "pending" && (
                    <>
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                    </>
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

      {/* Modal */}
      {selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal background */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSelectedMember(null)}
          ></div>
          {/* Modal content */}
          <div className="bg-white text-black rounded-lg overflow-y-auto max-h-screen w-full max-w-2xl p-6 relative z-10">
            <h3 className="text-xl font-bold mb-4">
              {selectedMember.firstName} {selectedMember.middleName}{" "}
              {selectedMember.familyName}&apos;s Profile
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {selectedMember.email}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(selectedMember.dob).toLocaleDateString()}
              </p>
              <p>
                <strong>Blood Group:</strong> {selectedMember.bloodGroup}
              </p>
              <p>
                <strong>Education:</strong> {selectedMember.education}
              </p>
              <p>
                <strong>Mobile Number:</strong> {selectedMember.mobileNumber}
              </p>
              <p>
                <strong>WhatsApp Number:</strong>{" "}
                {selectedMember.whatsappNumber}
              </p>
              <p>
                <strong>Gender:</strong> {selectedMember.gender}
              </p>
              <p>
                <strong>Marital Status:</strong> {selectedMember.maritalStatus}
              </p>
              <p>
                <strong>Association:</strong> {selectedMember.association}
              </p>
              <p>
                <strong>International Address:</strong>{" "}
                {selectedMember.internationalFlat},{" "}
                {selectedMember.internationalBlock},{" "}
                {selectedMember.internationalStreetAddress},{" "}
                {selectedMember.internationalCity},{" "}
                {selectedMember.internationalStateProvince},{" "}
                {selectedMember.internationalPostalCode},{" "}
                {selectedMember.internationalCountry}
              </p>
              <p>
                <strong>Native Address:</strong> {selectedMember.nativeFlat},{" "}
                {selectedMember.nativeBlock}, {selectedMember.district},{" "}
                {selectedMember.area}, {selectedMember.nativePincode},{" "}
                {selectedMember.nativeCity}, {selectedMember.nativeState}
              </p>
              <p>
                <strong>Father&apos;s Name:</strong> {selectedMember.fatherName}
              </p>
              <p>
                <strong>Mother&apos;s Name:</strong> {selectedMember.motherName}
              </p>
              <p>
                <strong>Spouse&apos;s Name:</strong> {selectedMember.spouseName}
              </p>
              {/* Add any other fields as needed */}
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

export default SAMemberList;
