"use client";
import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaFileInvoice,
  FaRegCalendarAlt,
  FaSignOutAlt,
  FaUpload,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios for API requests
import Loader from "../loader/Loader"; // Import the Loader component

const AhSidebar = () => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  const handleLogoClick = () => {
    router.push("/landingAH"); // Pushes to the homepage or update to the desired page path
  };

  const handleMemberListClick = () => {
    router.push("/AHmembers");
  };

  const handleLogoutClick = async () => {
    try {
      // Clear token from local storage (or wherever you're storing it)
      localStorage.removeItem("token"); // Replace 'token' with your actual token key

      // Redirect to the login page after logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally handle the error, show a message, etc.
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    setIsLoading(true); // Show loader when upload starts

    // Create FormData and append the selected file
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the file to the backend API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/association/uploadMembershipBulks`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Make sure we are sending as multipart/form-data
          },
        }
      );

      if (response.status === 200) {
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload the file. Please try again.");
      }

      setFile(null); // Clear the file selection after successful upload
      setShowModal(false); // Close the modal after upload
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload the file. Please try again.");
    } finally {
      setIsLoading(false); // Hide loader when upload finishes
    }
  };

  return (
    <div className="flex flex-col text-white bg-blue-500 ml-8 mt-34 p-4 w-full rounded-lg sm:w-56">
      {/* Clickable logo */}
      <div
        className="flex justify-center mb-10 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img
          src="/gkcc.png" // Update this with the correct logo path
          alt="Logo"
          className="h-40 w-48 object-contain rounded-lg" // Adjust the height and width as needed
        />
      </div>

      <div
        className="flex items-center mt-8 mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition"
        onClick={handleMemberListClick}
      >
        <FaUsers className="text-2xl" />
        <span className="ml-4 sm:ml-8">Member List</span>
      </div>

      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition">
        <FaFileInvoice className="text-2xl" />
        <span className="ml-4 sm:ml-8">Transactions</span>
      </div>

      <div className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition">
        <FaRegCalendarAlt className="text-2xl" />
        <span className="ml-4 sm:ml-8">Events</span>
      </div>

      {/* Upload Bulk Button */}
      <div
        className="flex items-center mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-blue-800 transition"
        onClick={() => setShowModal(true)} // Open modal on click
      >
        <FaUpload className="text-2xl" />
        <span className="ml-4 sm:ml-8">Upload Members</span>
      </div>

      {/* Modal for Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 className="text-2xl font-bold text-blue-500 mb-4">
              Upload Excel Sheet
            </h2>
            <input
              type="file"
              id="fileInput"
              accept=".xlsx, .xls" // Accept Excel files only
              className="mb-4 w-full" // Full width
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-black font-semibold">
                Selected file: {file.name}
              </p>
            )}
            <div className="flex justify-between mt-4">
              <button
                className={`p-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700 transition w-1/2 mr-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleUpload} // Call handleUpload when this button is clicked
                disabled={isLoading} // Disable button when loading
              >
                Upload
              </button>
              <button
                className={`p-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 transition w-1/2 ml-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setShowModal(false)} // Close modal
                disabled={isLoading} // Disable button when loading
              >
                Cancel
              </button>
            </div>

            {/* Show Loader when uploading */}
            {isLoading && (
              <div className="mt-4">
                <Loader />
              </div>
            )}
          </div>
        </div>
      )}

      <div
        className="flex items-center mt-24 mb-6 cursor-pointer backdrop-blur-md bg-white text-black p-3 rounded hover:bg-red-600 transition"
        onClick={handleLogoutClick}
      >
        <FaSignOutAlt className="text-2xl" />
        <span className="ml-4 sm:ml-8">Logout</span>
      </div>
    </div>
  );
};

export default AhSidebar;
