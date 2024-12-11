import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditVideosAlbums = () => {
  const [albums, setAlbums] = useState([]); // List of albums
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Currently selected album
  const [albumName, setAlbumName] = useState(''); // Editable album name
  const [videos, setVideos] = useState([]); // Videos in the selected album
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/video-albums'); // Replace with your API endpoint
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
      setErrorMessage('Failed to fetch albums. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumSelect = (e) => {
    const albumId = parseInt(e.target.value);
    const album = albums.find((a) => a.id === albumId);
    setSelectedAlbum(album);
    setAlbumName(album?.name || '');
    setVideos(album?.videos || []);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  const extractYouTubeVideoId = (link) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const handleVideoAdd = async (url) => {
    if (videos.length >= 20) {
      setErrorMessage('You can only add up to 20 videos.');
      return;
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      setErrorMessage('Invalid YouTube video link.');
      return;
    }

    if (videos.some((video) => video.videoId === videoId)) {
      setErrorMessage('This video is already in the album.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/video-albums/${selectedAlbum.id}/videos`, {
        videoId,
        url,
      }); // Replace with your API endpoint
      setVideos([...videos, response.data]);
      setErrorMessage(null);
      setSuccessMessage('Video added successfully.');
    } catch (error) {
      console.error('Error adding video:', error);
      setErrorMessage('Failed to add video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoDelete = async (videoId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/video-albums/${selectedAlbum.id}/videos/${videoId}`); // Replace with your API endpoint
      setVideos(videos.filter((video) => video.videoId !== videoId));
      setSuccessMessage('Video removed successfully.');
    } catch (error) {
      console.error('Error deleting video:', error);
      setErrorMessage('Failed to delete video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAlbum) {
      setErrorMessage('Please select an album.');
      return;
    }

    if (!albumName) {
      setErrorMessage('Album name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/video-albums/${selectedAlbum.id}`, {
        name: albumName,
      }); // Replace with your API endpoint
      setSuccessMessage('Album updated successfully.');
      fetchAlbums(); // Refresh albums after update
    } catch (error) {
      console.error('Error updating album:', error);
      setErrorMessage('Failed to update album. Please try again.');
    } finally {
      setLoading(false);
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
          value={selectedAlbum?.id || ''}
        >
          <option value="" disabled>
            -- Select an album --
          </option>
          {albums.map((album) => (
            <option key={album.id} value={album.id}>
              {album.name}
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
                if (e.key === 'Enter') {
                  handleVideoAdd(e.target.value);
                  e.target.value = '';
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-2">Press Enter to add a video. Maximum 20 videos.</p>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

          {/* Success Message */}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

          {/* Videos List */}
          <h3 className="text-lg font-semibold text-blue-500 mb-4">Videos</h3>
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
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
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </>
      )}
    </div>
  );
};

export default EditVideosAlbums;
