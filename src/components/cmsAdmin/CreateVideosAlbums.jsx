import React, { useState } from "react";
import axios from "axios";

const CreateVideosAlbums = () => {
  const [albumName, setAlbumName] = useState("");
  const [videos, setVideos] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to extract YouTube Video ID from URL
  const extractYouTubeVideoId = (link) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  // Add video to the list
  const handleVideoAdd = (url) => {
    if (!url) {
      setErrorMessage("Please provide a video link.");
      return;
    }

    if (videos.length >= 20) {
      setErrorMessage("You can only add up to 20 videos.");
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      setErrorMessage("Invalid YouTube video link.");
      return;
    }

    if (videos.some((video) => video.videoId === videoId)) {
      setErrorMessage("This video is already in the album.");
      return;
    }

    setVideos([...videos, { videoId, url }]);
    setErrorMessage(null);
    setSuccessMessage("Video added successfully.");
  };

  // Remove a video from the list
  const handleVideoDelete = (videoId) => {
    setVideos(videos.filter((video) => video.videoId !== videoId));
    setSuccessMessage("Video removed successfully.");
  };

  // Submit album to the backend
  const handleSubmit = async () => {
    if (!albumName) {
      setErrorMessage("Album name is required.");
      return;
    }

    if (videos.length === 0) {
      setErrorMessage("Please add at least one video.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // API call to create video album
      const response = await axios.post(" https://api.gkcc.world/api/Videomedia/add", {
        nameofalbum: albumName, // Align with backend expectations
        videosdetails: videos,  // Align with backend expectations
      });

      setSuccessMessage("Album created successfully!");
      setAlbumName("");
      setVideos([]);
    } catch (error) {
      console.error("Error creating album:", error.response?.data || error);
      setErrorMessage(error.response?.data?.message || "Failed to create album. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-blue-500 rounded-lg p-6 shadow-md">
      <h2 className="text-center text-xl font-semibold text-blue-500 mb-4">Create Video Album</h2>

      {/* Album Name */}
      <div className="mb-4">
        <input
          type="text"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          placeholder="Enter album name"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add Video */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter YouTube video link"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleVideoAdd(e.target.value);
              e.target.value = "";
            }
          }}
        />
        <p className="text-sm text-gray-500 mt-2">Press Enter to add the video. Maximum 20 videos.</p>
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

      {/* Success Message */}
      {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

      {/* Videos List */}
      <h3 className="text-lg font-semibold text-blue-500 mb-4">Added Videos</h3>
      <div className="flex flex-col gap-4">
        {videos.map((video, index) => (
          <div
            key={index}
            className="w-full flex items-center bg-gray-100 border border-gray-300 rounded-lg p-4"
          >
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
              alt="Video Thumbnail"
              className="w-24 h-16 object-cover rounded-md mr-4"
            />
            <div className="flex flex-col flex-grow">
              <a
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mb-2"
              >
                Watch Video
              </a>
              <button
                onClick={() => handleVideoDelete(video.videoId)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition self-start"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-6 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Album"}
      </button>
    </div>
  );
};

export default CreateVideosAlbums;
