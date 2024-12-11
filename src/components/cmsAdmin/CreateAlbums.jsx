import React, { useState } from 'react';
import axios from 'axios';

const CreateAlbums = () => {
  const [albumName, setAlbumName] = useState('');
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    handleFileValidation(files);
  };

  const handleFileValidation = (files) => {
    const validFiles = files.filter((file) => {
      if (file.size > 4 * 1024 * 1024) {
        alert(`${file.name} is larger than 4MB and will not be added.`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > 20) {
      alert('You can only upload up to 20 images.');
      return;
    }

    setImages((prevImages) => [...prevImages, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileValidation(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!albumName) {
      setErrorMessage('Please enter an album name.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Please upload at least one image.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Create album in the backend
      const formData = new FormData();
      formData.append('nameofalbum', albumName);

      // Add images to FormData
      images.forEach((image, index) => {
        formData.append(`albumphotos`, image);
      });

      
      const response = await axios.post('https://api.gkcc.world/api/photoMedia/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage('Album created successfully!');
      setAlbumName('');
      setImages([]);
    } catch (error) {
      console.error('Error creating album:', error);
      setErrorMessage('Failed to create album. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Create Album</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="albumName">
            Album Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="albumName"
            value={albumName}
            onChange={handleAlbumNameChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter album name"
          />
        </div>

        <div
          className={`mb-4 p-4 border-2 ${
            isDragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
          } rounded text-center`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <label className="block text-gray-700 font-medium mb-2" htmlFor="uploadImages">
            Upload Images
          </label>
          <input
            type="file"
            id="uploadImages"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p className="text-gray-700 mb-2">Drag and drop your images here or click to upload.</p>
          <p className="text-sm text-gray-500">Maximum 4MB per image, up to 20 images.</p>
        </div>

        {images.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Uploaded Images</h3>
            <ul className="space-y-2">
              {images.map((image, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span className="text-sm text-gray-700 truncate">{image.name}</span>
                  <button
                    type="button"
                    onClick={() => handleImageDelete(index)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        {/* Success Message */}
        {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Album'}
        </button>
      </form>
    </div>
  );
};

export default CreateAlbums;
