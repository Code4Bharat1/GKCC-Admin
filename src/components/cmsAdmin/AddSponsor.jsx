import React, { useState } from 'react';

const AddSponsor = () => {
  const [logoError, setLogoError] = useState('');

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
          }
        };
      };

      reader.readAsDataURL(file);
    } else {
      setLogoError('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <form className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Add Sponsor</h2>
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            placeholder="Enter sponsor name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            placeholder="Enter sponsor description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        {/* Upload Logo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo* (Please upload an image with a 4:3 aspect ratio.)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleLogoValidation}
            required
          />
          {logoError && <p className="text-red-500 text-sm mt-1">{logoError}</p>}
        </div>
        {/* Upload Brochure */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Brochure (Optional)</label>
          <input
            type="file"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Uploading Link */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Link (Optional)</label>
          <input
            type="url"
            placeholder="Enter link"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          disabled={!!logoError} // Disable if there's a logo error
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddSponsor;
