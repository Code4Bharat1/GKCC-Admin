import React, { useState, useEffect } from "react";
import axios from "axios";

const EditNewsletter = () => {
  const [newsletters, setNewsletters] = useState([]); // Store fetched newsletters
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    para1: "",
    para2: "",
    img1: null,
    img2: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" }); // For notifications

  // Fetch newsletters from the view API on component mount
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/newsletter/view"
        );
        setNewsletters(response.data.data); // Assuming the API returns newsletters in `data.data`
      } catch (error) {
        console.error("Error fetching newsletters:", error);
        setAlert({
          type: "error",
          message: "Failed to fetch newsletters. Please try again.",
        });
      }
    };
    fetchNewsletters();
  }, []);

  // Handle dropdown selection
  const handleSelectNewsletter = (e) => {
    const selectedId = e.target.value;
    const newsletter = newsletters.find((n) => n._id === selectedId);

    setSelectedNewsletter(newsletter);

    if (newsletter) {
      setFormData({
        title: newsletter.title,
        heading: newsletter.heading,
        para1: newsletter.firstpara,
        para2: newsletter.secondpara,
        img1: null, // Reset to null for file input
        img2: null,
      });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file changes
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData({ ...formData, [name]: file });
  };

  // Handle form submission for updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    window.location.reload();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("heading", formData.heading);
    form.append("firstpara", formData.para1);
    form.append("secondpara", formData.para2);
    if (formData.img1) form.append("firstimage", formData.img1);
    if (formData.img2) form.append("secondimage", formData.img2);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/newsletter/edit/${selectedNewsletter._id}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setAlert({
          type: "success",
          message: "Newsletter updated successfully!",
        });
        // Refresh newsletters after update
        const updatedNewsletters = newsletters.map((n) =>
          n._id === selectedNewsletter._id ? response.data.data : n
        );
        setNewsletters(updatedNewsletters);
      }
    } catch (error) {
      console.error("Error updating newsletter:", error);
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to update the newsletter. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deletion
  const handleDelete = async () => {
    if (!selectedNewsletter) return;

    try {
      const response = await axios.delete(
        `http://localhost:5001/api/newsletter/delete/${selectedNewsletter._id}`
      );

      if (response.status === 200) {
        setAlert({
          type: "success",
          message: "Newsletter deleted successfully!",
        });
        // Remove the deleted newsletter from the list
        setNewsletters(newsletters.filter((n) => n._id !== selectedNewsletter._id));
        setSelectedNewsletter(null);
        setFormData({
          title: "",
          heading: "",
          para1: "",
          para2: "",
          img1: null,
          img2: null,
        });
      }
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      setAlert({
        type: "error",
        message:
          error.response?.data?.message ||
          "Failed to delete the newsletter. Please try again.",
      });
    }
  };

  // Custom Alert Component
  const Alert = ({ type, message, onClose }) => {
    const alertStyle =
      type === "success"
        ? "bg-green-100 border-green-500 text-green-700"
        : "bg-red-100 border-red-500 text-red-700";

    return (
      <div
        className={`border-l-4 p-4 mb-4 ${alertStyle} flex justify-between items-center`}
        role="alert"
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-6 shadow-xl">
      <h2 className="text-center text-3xl font-semibold text-blue-500 mb-6">
        Edit Newsletter
      </h2>

      {/* Custom Alert */}
      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: "", message: "" })}
        />
      )}

      {/* Dropdown for selecting newsletter */}
      <div className="mb-6">
        <label htmlFor="newsletter" className="block text-gray-700 font-medium mb-2">
          Select Newsletter
        </label>
        <select
          id="newsletter"
          onChange={handleSelectNewsletter}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
        >
          <option value="">-- Select Newsletter --</option>
          {newsletters.map((newsletter) => (
            <option key={newsletter._id} value={newsletter._id}>
              {newsletter.title}
            </option>
          ))}
        </select>
      </div>

      {/* Form to edit the selected newsletter */}
      {selectedNewsletter && (
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Heading Input */}
          <div className="mb-4">
            <label htmlFor="heading" className="block text-gray-700 font-medium mb-2">
              Heading
            </label>
            <input
              type="text"
              id="heading"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
              required
            />
          </div>

          {/* Paragraph 1 */}
          <div className="mb-4">
            <label htmlFor="para1" className="block text-gray-700 font-medium mb-2">
              Paragraph 1
            </label>
            <textarea
              id="para1"
              name="para1"
              value={formData.para1}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Paragraph 2 */}
          <div className="mb-4">
            <label htmlFor="para2" className="block text-gray-700 font-medium mb-2">
              Paragraph 2
            </label>
            <textarea
              id="para2"
              name="para2"
              value={formData.para2}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Image 1 */}
          <div className="mb-4">
            <label htmlFor="img1" className="block text-gray-700 font-medium mb-2">
              Image 1
            </label>
            <input
              type="file"
              id="img1"
              name="img1"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
              accept="image/*"
            />
          </div>

          {/* Image 2 */}
          <div className="mb-4">
            <label htmlFor="img2" className="block text-gray-700 font-medium mb-2">
              Image 2
            </label>
            <input
              type="file"
              id="img2"
              name="img2"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
              accept="image/*"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Delete Newsletter
          </button>
        </form>
      )}
    </div>
  );
};

export default EditNewsletter;
