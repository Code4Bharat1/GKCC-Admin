"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
const AMemberList = () => {
  const [filter, setFilter] = useState("pending"); // Default to 'pending' to show pending members first
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        let url;
        if (filter === "pending") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getPendingAssociation`;
        } else if (filter === "allowed") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getAcceptedAssociation`;
        } else if (filter === "rejected") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getRejectedAssociation`;
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
  }, [filter]);

  const handleAccept = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/association/approveAssociation/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(members.filter((member) => member._id !== memberId));
      setSelectedMember(null);
    } catch (err) {
      console.error("Error accepting member:", err);
    }
  };

  const handleReject = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/association/rejectAssociation/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers(members.filter((member) => member._id !== memberId));
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
      <h2 className="text-lg font-bold mb-4">Association list</h2>

      <div className="flex justify-between mb-4">
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
                <td className="px-4 py-2">{member.associationName}</td>
                <td className="px-4 py-2">{member.country}</td>
                <td className="px-4 py-2">{member.president?.name}</td>
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

      {/* Modal */}
      {selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSelectedMember(null)}
          ></div>
          <div className="bg-white text-black rounded-lg overflow-y-auto max-h-screen w-full max-w-2xl p-6 relative z-10">
            <h3 className="text-xl font-bold mb-4">
              {selectedMember.president?.name}&apos;s Profile
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {selectedMember.president?.email}
              </p>
              <p>
                <strong>Mobile Number:</strong>{" "}
                {selectedMember.president?.mobileNumber}
              </p>
              <p>
                <strong>WhatsApp Number:</strong>{" "}
                {selectedMember.president?.whatsappNumber}
              </p>
              <p>
                <strong>Association:</strong> {selectedMember.associationName}
              </p>
              <p>
                <strong>Country:</strong> {selectedMember.country}
              </p>
              <p>
                <strong>Secretary Name:</strong>{" "}
                {selectedMember.secretary?.name}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={selectedMember.websiteLink}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedMember.websiteLink}
                </a>
              </p>
              <p>
                <strong>Year Established:</strong>{" "}
                {selectedMember.yearEstablished}
              </p>
              <p>
                <strong>Number of Members:</strong>{" "}
                {selectedMember.numberOfMembers}
              </p>
              <p>
                <strong>Association Activities:</strong>{" "}
                {selectedMember.associationActivities}
              </p>
              <p>
                <strong>Activity Date:</strong>{" "}
                {new Date(selectedMember.activityDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Signature:</strong>
                <Image
                  src={selectedMember.president.signature}
                  alt="Signature"
                  className="mt-2"
                  height={128} // Adjust the height as needed
                  width={256} // Adjust the width as needed
                />
              </p>
              <p>
                <strong>Association Logo:</strong>
                <Image
                  src={selectedMember.associationLogo}
                  alt="Association Logo"
                  className="mt-2"
                  height={128} // Adjust the height as needed
                  width={256} // Adjust the width as needed
                />
              </p>
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

export default AMemberList;
