import React, { useState, useEffect } from "react";
import axios from "axios";

const EditVideosAlbums = () => {
  const [albums, setAlbums] = useState([]); // List of albums
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Currently selected album
  const [albumName, setAlbumName] = useState(""); // Editable album name
  const [videos, setVideos] = useState([]); // Videos in the selected album
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, videoId: null }); // For custom delete confirmation

  // Fetch albums on component mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Fetch all albums
  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get(" https://api.gkcc.world/api/Videomedia/viewalbum");
      const albumsData = response.data?.message || [];
      setAlbums(Array.isArray(albumsData) ? albumsData : []);
    } catch (error) {
      setErrorMessage("Failed to fetch albums. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle album selection
  const handleAlbumSelect = (e) => {
    const albumId = e.target.value;
    const album = albums.find((a) => a._id === albumId);
    setSelectedAlbum(album);
    setAlbumName(album?.nameofalbum || "");
    setVideos(
      album?.videosdetails?.map((video) => ({
        ...video,
        videoId: extractYouTubeVideoId(video.url),
      })) || []
    );
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Update album name
  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (link) => {
    const regex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  // Add a video to the album
  const handleVideoAdd = async (url) => {
    if (!selectedAlbum) {
      setErrorMessage("Please select an album first.");
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      setErrorMessage("Invalid YouTube video link.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        ` https://api.gkcc.world/api/Videomedia/addvideo/${selectedAlbum._id}`,
        { url, videoId }
      );
      const updatedVideos = response.data.data?.videosdetails || [];
      setVideos(
        updatedVideos.map((video) => ({
          ...video,
          videoId: extractYouTubeVideoId(video.url),
        }))
      );
      setSelectedAlbum((prev) => ({
        ...prev,
        videosdetails: updatedVideos,
      }));
      setSuccessMessage("Video added successfully!");
    } catch (error) {
      setErrorMessage("Failed to add video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a video from the album
  const handleVideoDelete = async () => {
    if (!deleteModal.videoId || !selectedAlbum) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        ` https://api.gkcc.world/api/Videomedia/deletevideo/${selectedAlbum._id}/${deleteModal.videoId}`
      );
      const updatedVideos = response.data.data?.videosdetails || [];
      setVideos(
        updatedVideos.map((video) => ({
          ...video,
          videoId: extractYouTubeVideoId(video.url),
        }))
      );
      setSelectedAlbum((prev) => ({
        ...prev,
        videosdetails: updatedVideos,
      }));
      setSuccessMessage("Video removed successfully.");
    } catch (error) {
      setErrorMessage("Failed to delete video. Please try again.");
    } finally {
      setDeleteModal({ open: false, videoId: null });
      setLoading(false);
    }
  };

  // Save changes to the album (e.g., update the album name)
  const handleSubmit = async () => {
    if (!selectedAlbum) {
      setErrorMessage("Please select an album.");
      return;
    }

    if (!albumName) {
      setErrorMessage("Album name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(` https://api.gkcc.world/api/Videomedia/editalbum/${selectedAlbum._id}`, {
        nameofalbum: albumName,
      });
      setSuccessMessage("Album updated successfully.");
      fetchAlbums(); // Refresh albums after update
    } catch (error) {
      setErrorMessage("Failed to update album. Please try again.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white border border-blue-500 rounded-lg p-6 shadow-md">
      <h2 className="text-center text-xl font-semibold text-blue-500 mb-4">Edit Video Album</h2>

      {/* Select Album */}
      <div className="mb-4">
        <label htmlFor="selectAlbum" className="block text-gray-700 mb-2">
          Select Album
        </label>
        <select
          id="selectAlbum"
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleAlbumSelect}
          value={selectedAlbum?._id || ""}
        >
          <option value="" disabled>
            -- Select an album --
          </option>
          {albums.map((album) => (
            <option key={album._id} value={album._id}>
              {album.nameofalbum}
            </option>
          ))}
        </select>
      </div>

      {selectedAlbum && (
        <>
          {/* Edit Album Name */}
          <div className="mb-4">
            <label htmlFor="albumName" className="block text-gray-700 mb-2">
              Album Name
            </label>
            <input
              type="text"
              id="albumName"
              value={albumName}
              onChange={handleAlbumNameChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter album name"
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
            <p className="text-sm text-gray-500 mt-2">
              Press Enter to add a video. Maximum 20 videos.
            </p>
          </div>

          {/* Messages */}
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

          {/* Videos List */}
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Videos</h3>
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <div
                key={video._id}
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
                    onClick={() => setDeleteModal({ open: true, videoId: video._id })}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition self-start"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Save Changes Button */}
          <button
            onClick={handleSubmit}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-6 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this video?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setDeleteModal({ open: false, videoId: null })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleVideoDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditVideosAlbums;
