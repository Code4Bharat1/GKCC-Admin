import React, { useState } from 'react';
import axios from 'axios';

const AddSponsor = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    brochure: '', 
    websitelink: '',
  });
  const [logoError, setLogoError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFormData({ ...formData, [name]: files[0] });
  // };

  const handleLogoValidation = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          // Check for 4:3 ratio (width / height = 4 / 3)
          if (Math.abs(width / height - 4 / 3) > 0.01) {
            setLogoError('Please upload an image with a 4:3 aspect ratio.');
            e.target.value = ''; // Reset the input
          } else {
            setLogoError('');
            setFormData({ ...formData, logo: file });
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      setLogoError('');
      setFormData({ ...formData, logo: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (logoError) {
      return;
    }
    setIsLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.logo) {
      data.append('logo', formData.logo);
    }
   
    data.append('brochure', formData.brochure); // Pass brochure URL
    
    data.append('websitelink', formData.websitelink);

    console.log('Submitting data:', Object.fromEntries(data.entries())); // Logs the payload for debugging

    try {
      const response = await axios.post('http://localhost:5001/api/sponsor/addSponsor', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      setSuccessMessage('Sponsor added successfully!');
    } catch (error) {
      setSubmissionError('Failed to add sponsor. Please try again.');
      console.error('Submission error:', error);
    }finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Add Sponsor</h2>
        {submissionError && <p className="text-red-500 text-sm mb-4">{submissionError}</p>}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter sponsor name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter sponsor description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        {/* Upload Logo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Logo* (Please upload an image with a 4:3 aspect ratio.)
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleLogoValidation}
            required
          />
          {logoError && <p className="text-red-500 text-sm mt-1">{logoError}</p>}
        </div>
        {/* Brochure URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Brochure URL (Optional)</label>
          <input
            type="url"
            name="brochure"
            value={formData.brochure}
            onChange={handleInputChange}
            placeholder="Enter brochure link"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Uploading Link */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Link (Optional)</label>
          <input
            type="url"
            name="websitelink"
            value={formData.websitelink}
            onChange={handleInputChange}
            placeholder="Enter link"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}disabled={isLoading} // Disable the button when loading
          aria-busy={isLoading}
          aria-label="Submit images"
          
        >
         {isLoading ? (
          <>
            {/* SVG Spinner */}
            <svg
              className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"
              viewBox="0 0 24 24"
              aria-hidden="true"
            ></svg>
            Submitting...
          </>
        ) : (
          'Submit'
        )}
        </button>
      </form>
    </div>
  );
};

export default AddSponsor;
