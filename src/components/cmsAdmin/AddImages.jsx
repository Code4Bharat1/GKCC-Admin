import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Alert Component for displaying messages and confirmations
const Alert = ({ message, onClose, onConfirm, isConfirm }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-heading"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <p id="alert-heading" className="text-gray-700 mb-4">
          {message}
        </p>
        <div className="flex justify-center space-x-4">
          {isConfirm ? (
            <>
              <button
                onClick={onConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                aria-label="Confirm deletion"
              >
                Confirm
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              aria-label="Close alert"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AddImages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // Loading state for fetching submitted images
  const [images, setImages] = useState([]); // Images being uploaded
  const [submittedImages, setSubmittedImages] = useState([]); // Persistent submitted images from backend
  const [alertMessage, setAlertMessage] = useState(null); // For showing custom alerts
  const [imageToDelete, setImageToDelete] = useState(null); // Holds the ID of the image to delete
  const maxImages = 20;
  const maxFileSize = 4 * 1024 * 1024; // 4 MB in bytes

  // Fetch submitted images from backend on component mount
  useEffect(() => {
    fetchSubmittedImages();

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      images.forEach((imageObj) => URL.revokeObjectURL(imageObj.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch submitted images from the backend
  const fetchSubmittedImages = async () => {
    setIsFetching(true); // Start fetching
    try {
      const response = await axios.get('http://localhost:5001/api/photomedia/viewphotosofmediapage');
      console.log('Fetched Submitted Images Response:', response);
      console.log('Fetched Submitted Images Data:', response.data);

      // Extract images from the 'message' array
      if (response.data && Array.isArray(response.data.message)) {
        setSubmittedImages(response.data.message);
      } else {
        throw new Error('Unexpected response structure from server');
      }
    } catch (error) {
      console.error('Error fetching submitted images:', error);
      setAlertMessage('Failed to load submitted images.');
      setSubmittedImages([]); // Ensure it's an empty array on error
    } finally {
      setIsFetching(false); // End fetching
    }
  };

  // Handle image selection via file input
  const handleImageUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    addImages(uploadedFiles);
  };

  // Handle image drop via drag-and-drop
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    addImages(droppedFiles);
  };

  // Prevent default behavior for drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Function to add images to the upload queue after validation
  const addImages = (newImages) => {
    // Validate file sizes
    const validImages = newImages.filter((image) => {
      if (image.size > maxFileSize) {
        setAlertMessage(`Image "${image.name}" exceeds the 4MB size limit and was not added.`);
        return false;
      }
      return true;
    });

    // Validate maximum number of images
    if (validImages.length + images.length > maxImages) {
      setAlertMessage(`You can only add up to ${maxImages} images at a time.`);
      return;
    }

    // Create preview URLs for valid images
    const imagesWithPreview = validImages.map((image) => ({
      file: image,
      preview: URL.createObjectURL(image),
    }));

    setImages((prevImages) => [...prevImages, ...imagesWithPreview]);
  };

  // Function to remove an image from the upload queue
  const removeImage = (index) => {
    const imageToRemove = images[index];
    URL.revokeObjectURL(imageToRemove.preview); // Revoke the object URL to prevent memory leaks

    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Function to initiate image deletion with confirmation
  const initiateRemoveSubmittedImage = (id) => {
    setImageToDelete(id);
  };

  // Function to confirm deletion
  const confirmRemoveSubmittedImage = async () => {
    if (!imageToDelete) return;

    try {
      await axios.delete(`http://localhost:5001/api/photomedia/deletephotomedia/${imageToDelete}`);
      const updatedSubmittedImages = submittedImages.filter((image) => image._id !== imageToDelete);
      setSubmittedImages(updatedSubmittedImages);
      setAlertMessage('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image:', error);
      setAlertMessage('Failed to delete image.');
    } finally {
      setImageToDelete(null);
    }
  };

  // Function to cancel deletion
  const cancelRemoveSubmittedImage = () => {
    setImageToDelete(null);
  };

  // Function to handle image submission to the backend
  const handleSubmit = async () => {
    if (images.length === 0) {
      setAlertMessage('No images to submit.');
      return;
    }

    // Create a FormData object for file uploads
    const formData = new FormData();
    images.forEach((imageObj) => formData.append('photos', imageObj.file));
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/photomedia/addphotosofmediapage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response);
      console.log('Response Data:', response.data);

      // Validate response
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      setAlertMessage(`Submitted ${images.length} image${images.length !== 1 ? 's' : ''}.`);

      // Update submitted images based on the structure of response.data
      if (response.data && Array.isArray(response.data.message)) {
        setSubmittedImages((prev) => [...prev, ...response.data.message]);
      } else if (response.data && response.data.message && Array.isArray(response.data.message)) {
        setSubmittedImages((prev) => [...prev, ...response.data.message]);
      } else {
        // If the response does not contain a 'message' array, fetch the images again
        await fetchSubmittedImages();
      }

      // Clear the upload queue and revoke object URLs
      images.forEach((imageObj) => URL.revokeObjectURL(imageObj.preview));
      setImages([]);
    } catch (error) {
      console.error('Error submitting images:', error);

      // Provide more detailed error messages if possible
      if (error.response && error.response.data && error.response.data.message) {
        setAlertMessage(`Failed to submit images: ${error.response.data.message}`);
      } else {
        setAlertMessage('Failed to submit images.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-blue-500 rounded-lg p-6 shadow-md">
      <h2 className="text-center text-xl font-semibold text-blue-500 mb-4">Add Images</h2>

      {/* Drag and Drop Upload Box */}
      <div
        className="border-2 border-dashed border-blue-500 rounded-lg p-20 flex flex-col items-center mb-4"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          id="file-input"
          className="hidden"
        />
        <label htmlFor="file-input" className="cursor-pointer text-blue-500 text-sm text-center">
          Drag and drop images here or click to upload{' '}
          <span className="text-red-500">(max {maxImages} images, max 4MB each).</span>
        </label>
      </div>

      {/* Image Preview for Upload */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        {images.map((imageObj, index) => (
          <div key={index} className="relative w-24 h-24">
            <img
              src={imageObj.preview}
              alt={`preview-${index}`}
              className="w-full h-full object-cover rounded-md"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs px-2 py-1"
              aria-label={`Remove uploaded image ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mb-6 flex items-center justify-center ${
          isLoading ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={isLoading} // Disable the button when loading
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

      {/* Submitted Images */}
      <h3 className="text-lg font-semibold text-blue-500 mb-4">Submitted Images</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {isFetching ? (
          <div className="flex items-center justify-center w-full">
            {/* SVG Spinner */}
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <span className="ml-2 text-gray-500">Fetching images...</span>
          </div>
        ) : Array.isArray(submittedImages) && submittedImages.length > 0 ? (
          submittedImages.map((image, index) => {
            console.log('Rendering image:', image);

            // Determine the correct URL property
            const imageUrl = image.url || image.imageUrl || image.src || (image.data && image.data.url) || '';

            if (!imageUrl) {
              // If no valid URL is found, display a placeholder
              console.warn(`Image at index ${index} does not have a valid URL.`);
              return (
                <div
                  key={image._id || index}
                  className="relative w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md"
                >
                  <span className="text-xs text-red-500">Invalid Image</span>
                </div>
              );
            }

            return (
              <div key={image._id || index} className="relative w-24 h-24">
                <img
                  src={imageUrl}
                  alt={`submitted-${image._id || index}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  onClick={() => initiateRemoveSubmittedImage(image._id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs px-2 py-1"
                  aria-label={`Remove submitted image ${image._id || index}`}
                >
                  Remove
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Fetching Images</p>
        )}
      </div>

      {/* Custom Alert Popup */}
      {alertMessage && !imageToDelete && (
        <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

      {imageToDelete && (
        <Alert
          message="Are you sure you want to delete this image?"
          onClose={cancelRemoveSubmittedImage}
          onConfirm={confirmRemoveSubmittedImage}
          isConfirm={true}
        />
      )}
    </div>
  );
};

export default AddImages;
