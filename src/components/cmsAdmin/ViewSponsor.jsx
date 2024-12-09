import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSponsor = () => {
  const [sponsors, setSponsors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedSponsor, setEditedSponsor] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch sponsors from the backend
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/sponsor/viewsponsors");
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


  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true); // Show confirmation modal
  };
  // Handle Delete Sponsor
  const handleDelete = async (id) => {
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5001/api/sponsor/deletesponsor/${id}`);
      setSponsors((prev) => prev.filter((sponsor) => sponsor._id !== id));
    } catch (err) {
      console.error("Error deleting sponsor:", err);
      setError("Failed to delete sponsor");
    }
  };

  // Handle entering edit mode
  const handleEdit = (sponsor) => {
    setEditingId(sponsor._id);
    setEditedSponsor({ ...sponsor });
  };

  // Handle exiting edit mode
  const handleCancel = () => {
    setEditingId(null);
    setEditedSponsor({});
  };

  // Handle saving edits
  const handleSave = async (id) => {
    try {
      const url = `http://localhost:5001/api/sponsor/editsponsorsdetails/${id}`;
      const formData = new FormData();
      formData.append("name", editedSponsor.name);
      formData.append("description", editedSponsor.description);
      formData.append("websitelink", editedSponsor.websitelink);
      formData.append("brochure", editedSponsor.brochure);
      if (editedSponsor.logo instanceof File) {
        formData.append("logo", editedSponsor.logo);
      }

      const response = await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  // Handle field changes
  const handleChange = (field, value) => {
    setEditedSponsor((prev) => ({ ...prev, [field]: value }));
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
                  onChange={(e) => handleChange("logo", e.target.files[0])}
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL</label>
                <input
                  type="url"
                  value={editedSponsor.brochure || ""}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => handleChange("brochure", e.target.value)}
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
                      View Brochure
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
                      Visit Website
                    </a>
                  ) : (
                    <span className="text-gray-500">No Website Available</span>
                  )}
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    onClick={() => handleEdit(sponsor)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
                    onClick={() => confirmDelete(sponsor._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this sponsor?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default ViewSponsor;
