import React, { useState } from 'react';
import axios from 'axios';

const CreateNewsletter = () => {
  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    firstpara: '',
    secondpara: '',
    firstimage: null,
    secondimage: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' }); // State for custom alert

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFormData({ ...formData, [name]: file });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append('title', formData.title);
    form.append('heading', formData.heading);
    form.append('firstpara', formData.firstpara);
    form.append('secondpara', formData.secondpara);
    form.append('firstimage', formData.firstimage);
    form.append('secondimage', formData.secondimage);

    try {
      const response = await axios.post(
        'http://localhost:5001/api/newsletter/add',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setAlert({ type: 'success', message: 'Newsletter created successfully!' });
        setFormData({
          title: '',
          heading: '',
          firstpara: '',
          secondpara: '',
          firstimage: null,
          secondimage: null,
        });
      } else {
        setAlert({
          type: 'error',
          message: response.data.message || 'Failed to create the newsletter.',
        });
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setAlert({
        type: 'error',
        message:
          error.response?.data?.message ||
          'An unexpected error occurred while submitting the form.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom Alert Component
  const Alert = ({ type, message, onClose }) => {
    const alertStyle =
      type === 'success'
        ? 'bg-green-100 border-green-500 text-green-700'
        : 'bg-red-100 border-red-500 text-red-700';

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
    <div className="w-full max-w-xl mx-auto bg-white border border-gray-300 rounded-lg p-6 shadow-xl">
      <h2 className="text-center text-3xl font-semibold text-blue-500 mb-4">
        Create Newsletter
      </h2>

      {/* Custom Alert */}
      {alert.message && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: '', message: '' })}
        />
      )}

      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title <span className="text-red-500">*</span>
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
          <label
            htmlFor="heading"
            className="block text-gray-700 font-medium mb-2"
          >
            Heading <span className="text-red-500">*</span>
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

        {/* First Paragraph */}
        <div className="mb-4">
          <label
            htmlFor="firstpara"
            className="block text-gray-700 font-medium mb-2"
          >
            First Paragraph <span className="text-red-500">*</span>
          </label>
          <textarea
            id="firstpara"
            name="firstpara"
            value={formData.firstpara}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Second Paragraph */}
        <div className="mb-4">
          <label
            htmlFor="secondpara"
            className="block text-gray-700 font-medium mb-2"
          >
            Second Paragraph <span className="text-red-500">*</span>
          </label>
          <textarea
            id="secondpara"
            name="secondpara"
            value={formData.secondpara}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* First Image */}
        <div className="mb-4">
          <label
            htmlFor="firstimage"
            className="block text-gray-700 font-medium mb-2"
          >
            First Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="firstimage"
            name="firstimage"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
            accept="image/*"
            required
          />
        </div>

        {/* Second Image */}
        <div className="mb-4">
          <label
            htmlFor="secondimage"
            className="block text-gray-700 font-medium mb-2"
          >
            Second Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="secondimage"
            name="secondimage"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-500"
            accept="image/*"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full mt-8 py-2 rounded-lg text-white ${
            isSubmitting ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } transition`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Create Newsletter'}
        </button>
      </form>
    </div>
  );
};

export default CreateNewsletter;
