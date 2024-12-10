import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopupSponsor = () => {
  const [image, setImage] = useState(null); // Current image from the backend
  const [selectedImage, setSelectedImage] = useState(null); // Image selected for upload
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error messages
  const [successMessage, setSuccessMessage] = useState(''); // Success messages
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [imageToDelete, setImageToDelete] = useState(null); // Image to delete

  // Fetch the existing image from the backend
  const fetchImage = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/sponsor/viewpopup`);
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_API}/sponsor/addpopupimage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedImage = response.data.data;
      if (uploadedImage) {
        setSuccessMessage('Image uploaded successfully!');
        setSelectedImage(null);
        setImage(uploadedImage);
        window.location.reload(); 
      }
    } catch (err) {
      setError('Failed to upload the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async () => {
    if (!imageToDelete) {
      setError('No image to delete.');
      return;
    }

    try {
      setIsLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_API}/sponsor/deletepopup/${imageToDelete._id}`);
      setSuccessMessage('Image deleted successfully!');
      setImage(null);
      setImageToDelete(null); // Clear image to delete
    } catch (err) {
      setError('Failed to delete the image. Please try again.');
    } finally {
      setIsLoading(false);
      setIsModalOpen(false); // Close the modal after action
    }
  };

  // Fetch the image on component mount
  useEffect(() => {
    fetchImage();
  }, []);

  // Open the delete confirmation modal
  const openModal = (image) => {
    setImageToDelete(image); // Set the image to be deleted
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg ml-4 hover:bg-blue-600 ${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
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
            onClick={() => openModal(image)}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          {image === null ? "No image uploaded yet." : null}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-center">Confirm Deletion</h3>
            <p className="text-center mb-4">Are you sure you want to delete this image?</p>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupSponsor;
