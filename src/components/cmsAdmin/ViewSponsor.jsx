import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSponsor = () => {
  const [sponsors, setSponsors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedSponsor, setEditedSponsor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch sponsors from the backend
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get("https://api.gkcc.world/api/sponsor/viewsponsors");
        console.log("Fetched sponsors:", response.data); // Debug the response

        // Extract the sponsor array from the `message` field
        const sponsorArray = response.data.message || [];
        if (Array.isArray(sponsorArray)) {
          setSponsors(sponsorArray);
        } else {
          setError("Invalid data format received");
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load sponsors");
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  // Handle entering edit mode
  const handleEdit = (sponsor) => {
    setEditingId(sponsor._id); // Backend uses `_id`
    setEditedSponsor({ ...sponsor });
  };

  // Handle exiting edit mode
  const handleCancel = () => {
    setEditingId(null);
    setEditedSponsor({});
  };

  // Handle field changes
  const handleChange = (field, value) => {
    setEditedSponsor((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file changes
  const handleFileChange = (field, file) => {
    setEditedSponsor((prev) => ({ ...prev, [field]: file }));
  };

  // Handle saving edits
  const handleSave = async (id) => {
    try {
      const url = `https://api.gkcc.world/api/sponsor/editsponsorsdetails/${id}`;
      console.log("PUT Request URL:", url); // Debug the URL being used

      const formData = new FormData();
      formData.append("name", editedSponsor.name);
      formData.append("description", editedSponsor.description);
      if (editedSponsor.logo instanceof File) {
        formData.append("logo", editedSponsor.logo);
      }
      if (editedSponsor.brochure instanceof File) {
        formData.append("brochure", editedSponsor.brochure);
      }

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update response:", response.data); // Log the response
      setSponsors((prev) =>
        prev.map((sponsor) =>
          sponsor._id === id ? { ...sponsor, ...response.data.data } : sponsor
        )
      );
      setEditingId(null);
      setEditedSponsor({});
    } catch (err) {
      console.error(err);
      setError("Failed to update sponsor");
    }
  };

  if (loading) {
    return <div>Loading sponsors...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <h2 className="text-center text-3xl font-bold text-blue-500 mb-8">View Sponsors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
          >
            {editingId === sponsor._id ? (
              <div className="p-4">
                {/* Edit Form */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editedSponsor.name || ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editedSponsor.description || ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-24"
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Link</label>
                <input
                  type="url"
                  value={editedSponsor.websitelink || ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => handleChange("websitelink", e.target.value)}
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => handleFileChange("logo", e.target.files[0])}
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Brochure</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => handleFileChange("brochure", e.target.files[0])}
                />
                <div className="flex gap-2">
                  <button
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => handleSave(sponsor._id)}
                  >
                    Save
                  </button>
                  <button
                    className="w-full bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* Sponsor Details */}
                <div className="p-4 bg-blue-500 flex justify-center items-center">
                  <img
                    src={sponsor.logo}
                    alt={`${sponsor.name} logo`}
                    className="w-52 h-36 object-cover rounded-lg border-4 border-white"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{sponsor.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{sponsor.description}</p>
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Brochure: </span>
                  {sponsor.brochure ? (
                    <a
                      href={sponsor.brochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-gray-500">No Brochure Available</span>
                  )}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Website: </span>
                  {sponsor.websitelink ? (
                    <a
                      href={sponsor.websitelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Visit
                    </a>
                  ) : (
                    <span className="text-gray-500">No Website Available</span>
                  )}
                </div>
                <button
                  className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => handleEdit(sponsor)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSponsor;
