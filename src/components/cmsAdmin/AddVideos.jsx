// src/components/AddVideos.jsx

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

const AddVideos = () => {
  // State Variables
  const [url, setUrl] = useState('');
  const [submittedVideos, setSubmittedVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null); // Holds the ID of the video to delete
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Define API Base URL
  const API_BASE_URL = 'https://api.gkcc.world/api/videomedia';

  useEffect(() => {
    fetchSubmittedVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to extract YouTube Video ID
  const extractYouTubeVideoId = (link) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  // Fetch submitted videos from the backend
  const fetchSubmittedVideos = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/viewvideosofmediapage`);
      console.log('Fetched Videos:', response.data); // Debugging line
      if (response.data && Array.isArray(response.data.message)) {
        setSubmittedVideos(response.data.message);
        console.log('Submitted Videos:', response.data.message); // Verify structure
      } else {
        // Handle unexpected response structure
        console.error('Unexpected response structure:', response.data);
        setErrorMessage('Unexpected data format received from the server.');
        setSubmittedVideos([]);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      setErrorMessage('Failed to load submitted videos.');
      setSubmittedVideos([]); // Reset to empty array on error
    } finally {
      setIsFetching(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Reset messages
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isValidYouTubeLink(url)) {
      setErrorMessage('Please enter a valid YouTube video link.');
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      setErrorMessage('Unable to extract Video ID from the provided link.');
      return;
    }

    // Check if the video already exists in the backend
    const exists = submittedVideos.some((video) => video.videoId === videoId);
    if (exists) {
      setErrorMessage('This video has already been submitted.');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting URL:', url);
      // **Send { url } instead of { videoLink: url }**
      const response = await axios.post(`${API_BASE_URL}/addvideosofmediapage`, { url });
      console.log('Video Added:', response.data); // Debugging line

      // Assuming the backend returns the created video object in `message`
      setSubmittedVideos([response.data.message, ...submittedVideos]); // Prepend the new video
      setSuccessMessage('Video submitted successfully.');
      setUrl('');
    } catch (error) {
      console.error('Error submitting video:', error);
      console.log('Error Response:', error.response); // Debugging line
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to submit video.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deletion initiation
  const initiateDelete = (videoId) => {
    setVideoToDelete(videoId);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (!videoToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/deletevideomedia/${videoToDelete}`);
      const updatedVideos = submittedVideos.filter((video) => video._id !== videoToDelete);
      setSubmittedVideos(updatedVideos);
      setSuccessMessage('Video deleted successfully.');
    } catch (error) {
      console.error('Error deleting video:', error);
      setErrorMessage('Failed to delete video.');
    } finally {
      setVideoToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setVideoToDelete(null);
  };

  // Validation for YouTube links
  const isValidYouTubeLink = (link) => {
    const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(link);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-blue-500 rounded-lg p-6 shadow-md">
      <h2 className="text-center text-xl font-semibold text-blue-500 mb-4">
        Add Videos <span className="text-sm text-red-500">(1 link at a time)</span>
      </h2>

      {/* Input for Video Link */}
      <div className="mb-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube video link"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

      {/* Success Message */}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mb-6 flex items-center justify-center ${
          isSubmitting ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
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

      {/* Submitted Videos */}
      <h3 className="text-lg font-semibold text-blue-500 mb-4">Submitted Videos</h3>
      <div className="flex flex-col gap-4">
        {isFetching ? (
          <div className="flex items-center justify-center">
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
            <span className="ml-2 text-gray-500">Fetching videos...</span>
          </div>
        ) : submittedVideos.length > 0 ? (
          submittedVideos.map((video) => {
            // Attempt to get videoId from the video object
            let videoId = video.videoId;

            // If videoId is missing, extract it from the URL
            if (!videoId) {
              videoId = extractYouTubeVideoId(video.url);
            }

            // If videoId is still undefined, handle gracefully
            if (!videoId) {
              console.warn(`Could not extract videoId for video with _id: ${video._id}`);
              return (
                <div
                  key={video._id}
                  className="w-full flex items-center bg-gray-100 border border-gray-300 rounded-lg p-4"
                >
                  {/* Placeholder Thumbnail */}
                  <div className="w-24 h-16 bg-gray-300 rounded-md mr-4 flex items-center justify-center">
                    <span className="text-gray-500">No Thumbnail</span>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <p className="text-gray-500 mb-2">Invalid video URL.</p>
                    <button
                      onClick={() => initiateDelete(video._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition self-start"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            }

            // If videoId is valid, render the thumbnail and "Watch" link
            return (
              <div
                key={video._id}
                className="w-full flex items-center bg-gray-100 border border-gray-300 rounded-lg p-4"
              >
                {/* Video Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                  alt="Video Thumbnail"
                  className="w-24 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex flex-col flex-grow">
                  {/* "Watch" Link */}
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline mb-2"
                  >
                    Watch Video
                  </a>
                  {/* "Delete" Button */}
                  <button
                    onClick={() => initiateDelete(video._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition self-start"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Fetching Videos....</p>
        )}
      </div>

      {/* Confirmation Alert for Deletion */}
      {videoToDelete && (
        <Alert
          message="Are you sure you want to delete this video?"
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          isConfirm={true}
        />
      )}

      {/* Standard Alert for Error or Success Messages */}
      {/* These alerts are only shown when not in the middle of a deletion confirmation */}
      {!videoToDelete && errorMessage && (
        <Alert message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}
      {!videoToDelete && successMessage && (
        <Alert message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
    </div>
  );
};

export default AddVideos;
