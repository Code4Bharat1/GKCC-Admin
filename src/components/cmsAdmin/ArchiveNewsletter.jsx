"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const ArchiveNewsletter = () => {
  const [archivedNewsletters, setArchivedNewsletters] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch archived newsletters on component mount
  useEffect(() => {
    const fetchArchivedNewsletters = async () => {
      setLoading(true);
      try {
        const response = await axios.get(" https://api.gkcc.world/api/newsletter/viewarchive");
        setArchivedNewsletters(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching archived newsletters:", err);
        setError("Failed to load archived newsletters.");
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedNewsletters();
  }, []);

  // Handle dropdown selection
  const handleSelectNewsletter = (e) => {
    const selectedId = e.target.value;
    const newsletter = archivedNewsletters.find((n) => n._id === selectedId);
    setSelectedNewsletter(newsletter);
  };

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="text-center py-6 bg-blue-500 text-white">
        <h1 className="text-3xl font-bold">Archived Newsletters</h1>
      </div>

      {/* Dropdown */}
      <div className="p-6">
        <label htmlFor="newsletterDropdown" className="block text-gray-700 text-lg mb-2">
          Select a Newsletter:
        </label>
        <select
          id="newsletterDropdown"
          onChange={handleSelectNewsletter}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
        >
          <option value="">-- Select a Newsletter --</option>
          {archivedNewsletters.map((newsletter) => (
            <option key={newsletter._id} value={newsletter._id}>
              {newsletter.title} - {formatDate(newsletter.date)}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white shadow-md">
        {loading ? (
          <p className="text-center text-gray-500">Loading archived newsletters...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : selectedNewsletter ? (
          <div className="space-y-6">
            {/* Static Header and Image */}
            <div className="flex items-center gap-4">
              <div className="w-full md:w-60">
                <Image
                  src="/gkcc.png"
                  alt="Newsletter"
                  className="rounded-lg"
                  width={300}
                  height={300}
                  objectFit="cover"
                />
              </div>
              <div>
                <p className="text-md text-end md:text-xl text-black">{selectedNewsletter.title}</p>
                <p className="text-md text-end md:text-xl text-black">{formatDate(selectedNewsletter.date)}</p>
                <h1 className="text-2xl md:text-5xl font-semibold">
                  Global Kokani Committees&apos; Council
                </h1>
                <h2 className="mt-4 md:mt-8 text-2xl md:text-5xl border-b-4 border-black font-bold text-center">
                  Newsletter
                </h2>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl mt-4 md:text-4xl text-center font-bold text-blue-500">
              {selectedNewsletter.heading}
            </h1>

            {/* Sections */}
            {selectedNewsletter.section?.map((section, index) => {
              const { photo, text } = section;

              if (photo && !text) {
                return (
                  <div key={index} className="flex justify-center my-6">
                    <Image
                      src={photo}
                      alt={`Section ${index + 1}`}
                      width={500}
                      height={300}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                );
              }

              if (text && !photo) {
                return (
                  <div key={index} className="text-center my-6">
                    <p className="text-gray-700 text-lg">{text}</p>
                  </div>
                );
              }

              if (photo && text) {
                return (
                  <div key={index} className="flex flex-col md:flex-row items-center gap-6 my-6">
                    <p className="w-full md:w-1/2 text-gray-700 text-lg">{text}</p>
                    <div className="w-full md:w-1/2">
                      <Image
                        src={photo}
                        alt={`Section ${index + 1}`}
                        width={500}
                        height={300}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">Please select a newsletter.</p>
        )}
      </div>
    </div>
  );
};

export default ArchiveNewsletter;
