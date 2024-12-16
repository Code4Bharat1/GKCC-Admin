import React, { useState, useEffect } from "react";
import axios from "axios";

const AlertModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h3 className="text-lg font-bold mb-4">Alert</h3>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white py-1 px-4 rounded-lg"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h3 className="text-lg font-bold mb-4">Confirm</h3>
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-black py-1 px-4 rounded-lg mr-2"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-1 px-4 rounded-lg"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeSponsor = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSection, setNewSection] = useState({
    sponsorId: "",
    sectionName: "",
    selectedOption: "",
  });
  const [usedSections, setUsedSections] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sponsorId: "", sectionName: "" });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/sponsor/getsections`
        );
        const sponsorsData = response.data.sponsors || [];
        setSponsors(sponsorsData);

        const usedSectionsList = sponsorsData
          .flatMap((sponsor) => sponsor.sections.map((section) => section.sectionName));
        setUsedSections(usedSectionsList);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching sponsors:", err);
        setError("Failed to load sponsors. Please try again.");
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const addSection = async () => {
    const { sponsorId, sectionName, selectedOption } = newSection;

    if (!sponsorId || !sectionName || !selectedOption) {
      setAlertModal({ isOpen: true, message: "Please fill in all fields." });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/sponsor/addsections`,
        {
          sponsorId,
          sectionName,
          selectedOption,
        }
      );

      const updatedSponsor = response.data.sponsor;

      setSponsors((prevSponsors) =>
        prevSponsors.map((sponsor) =>
          sponsor._id === updatedSponsor._id ? updatedSponsor : sponsor
        )
      );

      setUsedSections((prevUsedSections) => [...prevUsedSections, sectionName]);
      setAlertModal({ isOpen: true, message: "Section added successfully!" });
      setNewSection({ sponsorId: "", sectionName: "", selectedOption: "" });
    } catch (err) {
      console.error("Error adding section:", err);
      setAlertModal({ isOpen: true, message: "Failed to add section. Please try again." });
    }
  };

  const confirmDelete = (sponsorId, sectionName) => {
    setDeleteModal({ isOpen: true, sponsorId, sectionName });
  };

  const deleteSection = async () => {
    const { sponsorId, sectionName } = deleteModal;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/sponsor/deletesections/${sponsorId}`,
        {
          data: { sectionName },
        }
      );

      const updatedSponsor = response.data.sponsor;

      setSponsors((prevSponsors) =>
        prevSponsors.map((sponsor) =>
          sponsor._id === updatedSponsor._id ? updatedSponsor : sponsor
        )
      );

      setUsedSections((prevUsedSections) =>
        prevUsedSections.filter((section) => section !== sectionName)
      );

      setAlertModal({ isOpen: true, message: "Section deleted successfully!" });
      setDeleteModal({ isOpen: false, sponsorId: "", sectionName: "" });
    } catch (err) {
      console.error("Error deleting section:", err);
      setAlertModal({ isOpen: true, message: "Failed to delete section. Please try again." });
    }
  };

  const handleFieldChange = (field, value) => {
    setNewSection((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div>Loading sponsors...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="py-8 px-4">
      <h2 className="text-center text-3xl font-bold text-blue-500 mb-8">
        Home Sponsors
      </h2>

      {/* Add New Section */}
      <div className="mb-8 bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Add New Section</h3>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Sponsor
          </label>
          <select
            className="w-full bg-white border border-gray-300 rounded-lg p-2"
            value={newSection.sponsorId}
            onChange={(e) => handleFieldChange("sponsorId", e.target.value)}
          >
            <option value="">Select Sponsor</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor._id} value={sponsor._id}>
                {sponsor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Section Name
          </label>
          <select
            className="w-full bg-white border border-gray-300 rounded-lg p-2"
            value={newSection.sectionName}
            onChange={(e) => handleFieldChange("sectionName", e.target.value)}
          >
            <option value="">Select Section</option>
            {["section 1", "section 2", "section 3", "section 4"].map(
              (sectionName) => (
                <option
                  key={sectionName}
                  value={sectionName}
                  disabled={usedSections.includes(sectionName)}
                >
                  {sectionName} {usedSections.includes(sectionName) && "(Used)"}
                </option>
              )
            )}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Option
          </label>
          <select
            className="w-full bg-white border border-gray-300 rounded-lg p-2"
            value={newSection.selectedOption}
            onChange={(e) =>
              handleFieldChange("selectedOption", e.target.value)
            }
          >
            <option value="">Select Option</option>
            {newSection.sponsorId &&
              sponsors
                .find((sponsor) => sponsor._id === newSection.sponsorId)
                ?.brochure && <option value="brochure">Brochure</option>}
            {newSection.sponsorId &&
              sponsors
                .find((sponsor) => sponsor._id === newSection.sponsorId)
                ?.websitelink && (
                <option value="websitelink">Website Link</option>
              )}
          </select>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          onClick={addSection}
        >
          Add Section
        </button>
      </div>

      {/* View Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map((sponsor) =>
          sponsor.sections.map((section, index) => (
            <div
              key={`${sponsor._id}-${index}`}
              className="bg-white p-6 border rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                {section.sectionName.toUpperCase()}
              </h3>
              <div>
                <h4 className="text-lg font-bold">{sponsor.name}</h4>
                {section.selectedOption === "brochure" && sponsor.brochure && (
                  <a
                    href={sponsor.brochure}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline block mt-2"
                  >
                    View Brochure
                  </a>
                )}
                {section.selectedOption === "websitelink" &&
                  sponsor.websitelink && (
                    <a
                      href={sponsor.websitelink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 underline block mt-2"
                    >
                      Visit Website
                    </a>
                  )}
              </div>
              <button
                className="mt-4 bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
                onClick={() => confirmDelete(sponsor._id, section.sectionName)}
              >
                Delete Section
              </button>
            </div>
          ))
        )}
      </div>

      {/* Custom Alerts */}
      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        onClose={() => setAlertModal({ isOpen: false, message: "" })}
      />
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        message="Are you sure you want to delete this section?"
        onConfirm={deleteSection}
        onCancel={() => setDeleteModal({ isOpen: false, sponsorId: "", sectionName: "" })}
      />
    </div>
  );
};

export default HomeSponsor;
