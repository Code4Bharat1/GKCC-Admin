import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopupSponsor = () => {
  const [image, setImage] = useState(null); // Current image from the backend
  const [selectedImage, setSelectedImage] = useState(null); // Image selected for upload
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error messages
  const [successMessage, setSuccessMessage] = useState(''); // Success messages

  // Fetch the existing image from the backend
  const fetchImage = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5001/api/sponsor/viewpopup');
      console.log('Fetched image:', response.data.data); // Debug the response
      setImage(response.data.data || null);
      setError('');
    } catch (err) {
      console.error('Failed to fetch image:', err);
      setError('Failed to fetch the current image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected image:', file);
      setSelectedImage(file);
      setError('');
    } else {
      setError('No file selected. Please choose an image.');
    }
  };

  // Handle image submission
  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', selectedImage);

    try {
      setIsLoading(true);
      console.log('Uploading image:', selectedImage);
      const response = await axios.post('http://localhost:5001/api/sponsor/addpopupimage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setSuccessMessage('Image uploaded successfully!');
      setSelectedImage(null);

      // Fetch the updated image directly after successful upload
      await fetchImage();
    } catch (err) {
      console.error('Failed to upload image:', err.response || err.message);
      setError('Failed to upload the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async () => {
    if (!image || !image._id) {
      setError('No image to delete.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this image?');
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      console.log('Deleting image with ID:', image._id);
      await axios.delete(`http://localhost:5001/api/sponsor/deletepopup/${image._id}`);
      setSuccessMessage('Image deleted successfully!');
      setImage(null); // Clear the displayed image
    } catch (err) {
      console.error('Failed to delete image:', err.response || err.message);
      setError('Failed to delete the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the image on component mount
  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Pop Up Sponsor</h2>

      {/* Upload Section */}
      <div className="mb-6 flex justify-center items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border-2 border-blue-500 p-2 rounded-lg"
        />
        <button
          onClick={handleSubmit}
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg ml-4 hover:bg-blue-600 
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload'
          )}
        </button>
      </div>

      {/* Success and Error Messages */}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Display Uploaded Image */}
      {image ? (
        <div className="relative border rounded-lg p-2 shadow-lg text-center">
          <img
            src={image.logo}
            alt="Popup Sponsor"
            className="w-full h-auto rounded-lg mx-auto"
          />
          <button
            onClick={handleDelete}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500">No image uploaded yet.</div>
      )}
    </div>
  );
};

export default PopupSponsor;
