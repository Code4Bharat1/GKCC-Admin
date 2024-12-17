import React, { useState, useEffect } from "react";
import axios from "axios";

const EditNewsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    date: "",
    sectionData: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Fetch newsletters from the API
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get(" https://api.gkcc.world/api/newsletter/view");
        console.log("API Response:", response.data.data);
        setNewsletters(response.data.data || []);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setAlert({ type: "error", message: "Failed to fetch newsletters." });
      }
    };
    fetchNewsletters();
  }, []);

  const handleSelectNewsletter = (e) => {
    const selectedId = e.target.value;
    const newsletter = newsletters.find((n) => n._id === selectedId);

    setSelectedNewsletter(newsletter);

    if (newsletter) {
      setFormData({
        title: newsletter.title,
        heading: newsletter.heading,
        date: newsletter.date,
        sectionData: newsletter.section || [],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...formData.sectionData];
    updatedSections[index][name] = value;
    setFormData({ ...formData, sectionData: updatedSections });
  };

  const handleFileChange = (index, e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      const updatedSections = [...formData.sectionData];
      updatedSections[index][name] = file;
      setFormData({ ...formData, sectionData: updatedSections });
    } else {
      const updatedSections = [...formData.sectionData];
      updatedSections[index][name] = null;
      setFormData({ ...formData, sectionData: updatedSections });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("title", formData.title);
    form.append("heading", formData.heading);
    form.append("date", formData.date);

    form.append("section", JSON.stringify(formData.sectionData));

    formData.sectionData.forEach((section, index) => {
      if (section.photo && section.photo instanceof File) {
        form.append(`photo${index}`, section.photo);
      }
    });

    try {
      await axios.put(
        ` https://api.gkcc.world/api/newsletter/edit/${selectedNewsletter._id}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setAlert({ type: "success", message: "Newsletter updated successfully!" });
    } catch (error) {
      console.error("Error updating newsletter:", error);
      setAlert({
        type: "error",
        message: "Failed to update the newsletter.",
      });
    } finally {
      setIsSubmitting(false);
      window.location.reload();
    }
  };

  const handleArchiveToggle = async () => {
    if (!selectedNewsletter) return;

    try {
      await axios.put(
        ` https://api.gkcc.world/api/newsletter/addarchive/${selectedNewsletter._id}`
      );

      const newStatus =
        selectedNewsletter.newsletterTypes === "archives" ? "normal" : "archives";

      setAlert({
        type: "success",
        message: `Newsletter ${
          newStatus === "archives" ? "archived" : "unarchived"
        } successfully!`,
      });

      setNewsletters((prev) =>
        prev.map((n) =>
          n._id === selectedNewsletter._id ? { ...n, newsletterTypes: newStatus } : n
        )
      );

      setSelectedNewsletter((prev) => ({ ...prev, newsletterTypes: newStatus }));
    } catch (error) {
      console.error("Error toggling archive status:", error);
      setAlert({ type: "error", message: "Failed to change archive status." });
    }
  };

  const Alert = ({ type, message, onClose }) => (
    <div
      className={`border-l-4 p-4 mb-4 ${
        type === "success"
          ? "bg-green-100 border-green-500 text-green-700"
          : "bg-red-100 border-red-500 text-red-700"
      }`}
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-sm text-gray-600 hover:text-gray-800 ml-4"
      >
        ✖
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-6 shadow-xl">
      <h2 className="text-center text-3xl font-semibold text-blue-500 mb-6">Edit Newsletter</h2>

      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Select Newsletter</label>
        <select
          onChange={handleSelectNewsletter}
          className="w-full border border-gray-300 rounded px-4 py-2"
        >
          <option value="">-- Select Newsletter --</option>
          {newsletters.map((newsletter) => (
            <option key={newsletter._id} value={newsletter._id}>
              {newsletter.title}
            </option>
          ))}
        </select>
      </div>

      {selectedNewsletter && (
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Status:</strong>{" "}
            {selectedNewsletter.newsletterTypes === "archives"
              ? "Archived"
              : "Normal"}
          </p>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          {formData.sectionData.map((section, index) => (
            <div key={index} className="mb-4 border-t pt-4">
              <h3>Section {index + 1}</h3>
              <textarea
                name="text"
                value={section.text}
                onChange={(e) => handleSectionChange(index, e)}
                rows="3"
                className="w-full border px-4 py-2 mb-4"
                placeholder="Enter section text"
              />
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => handleFileChange(index, e)}
                className="w-full border px-4 py-2"
              />
            </div>
          ))}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded mt-4 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Update Newsletter"}
          </button>

          <button
            type="button"
            onClick={handleArchiveToggle}
            className={`w-full mt-4 py-2 rounded ${
              selectedNewsletter.newsletterTypes === "archives"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-white"
            }`}
          >
            {selectedNewsletter.newsletterTypes === "archives"
              ? "Unarchive Newsletter"
              : "Archive Newsletter"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditNewsletter;
