import React, { useState } from 'react';

const PopupSponsor = () => {
  const [image, setImage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const [submittedImage, setSubmittedImage] = useState(null); // Store the submitted image

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a URL for the uploaded image
      setIsSuccess(false); // Reset success state when a new image is uploaded
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (image) {
      setIsSuccess(true); // Set success message after image upload
      setSubmittedImage(image); // Set the submitted image
      setImage(null); // Clear the image after submission
    }
  };

  return (
    <div className="p-6 ">
      <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Upload Sponsor Image</h2>

      {/* Image Upload Section */}
      {!isSuccess && !submittedImage && (
        <div className="mb-6 flex justify-center items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border-2 border-blue-500 p-2 rounded-lg "
          />
        </div>
      )}

      {/* Display uploaded image before submission */}
      {image && !isSuccess && (
        <div className="flex justify-center mb-6">
          <img
            src={image}
            alt="Uploaded"
            className="w-full max-w-md h-auto rounded-lg"
            style={{ aspectRatio: '4/3' }}
          />
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="text-center text-green-500 mb-6">
          <span className="text-3xl">&#10004;</span> Image uploaded successfully!
        </div>
      )}

      {/* Submitted Image Display */}
      {submittedImage && !isSuccess && (
        <div className="flex justify-center mb-6">
          <h3 className="text-xl font-semibold text-blue-500 mb-4">Submitted Image:</h3>
          <img
            src={submittedImage}
            alt="Submitted"
            className="w-full max-w-md h-auto rounded-lg"
            style={{ aspectRatio: '4/3' }}
          />
        </div>
      )}

      {/* Submit Button */}
      {!isSuccess && image && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default PopupSponsor;
