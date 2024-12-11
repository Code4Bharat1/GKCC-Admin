import React, { useState, useEffect } from "react";
import axios from "axios";

// Custom Modal for Confirmation
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
      <p className="text-gray-800 text-lg mb-4">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const EditAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showModal, setShowModal] = useState(false); // To show confirmation modal

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(
        "https://api.gkcc.world/api/photoMedia/viewphotosofmediapage"
      );
      const fetchedAlbums = Array.isArray(response.data?.message)
        ? response.data.message
        : [];
      setAlbums(fetchedAlbums);
    } catch (error) {
      console.error("Error fetching albums:", error);
      setErrorMessage("Failed to load albums. Please try again.");
      setAlbums([]);
    }
  };

  const handleAlbumSelect = (e) => {
    const albumId = e.target.value;
    const album = albums.find((a) => a._id === albumId);
    setSelectedAlbum(album);
    setAlbumName(album?.nameofalbum || "");
    setImages(album?.photosdetails || []);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 20) {
      alert("You can only upload up to 20 images.");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 4 * 1024 * 1024) {
        alert(`${file.name} is larger than 4MB and will not be added.`);
        return false;
      }
      return true;
    });

    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("albumphotos", file);
    });

    try {
      setLoading(true);
      const response = await axios.put(
        `https://api.gkcc.world/api/photoMedia/addphototoalbum/${selectedAlbum._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setImages((prevImages) => [
        ...prevImages,
        ...response.data.message.photosdetails,
      ]);
      setSuccessMessage("Images added successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrorMessage("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      setLoading(true);
      await axios.delete(
        `https://api.gkcc.world/api/photoMedia/deletesinglephoto/${selectedAlbum._id}/${imageId}`
      );
      setImages((prevImages) =>
        prevImages.filter((image) => image.etag !== imageId)
      );
      setSuccessMessage("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
      setErrorMessage("Failed to delete image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `https://api.gkcc.world/api/photoMedia/deletephotomedia/${selectedAlbum._id}`
      );
      setSuccessMessage(
        `Album "${selectedAlbum.nameofalbum}" deleted successfully!`
      );
      setSelectedAlbum(null);
      fetchAlbums(); // Refresh albums list
    } catch (error) {
      console.error("Error deleting album:", error);
      setErrorMessage("Failed to delete album. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAlbum) {
      alert("Please select an album to edit.");
      return;
    }

    if (!albumName) {
      alert("Album name cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `https://api.gkcc.world/api/photoMedia/editname/${selectedAlbum._id}`,
        {
          nameofalbum: albumName,
        }
      );
      setSuccessMessage(`Album "${albumName}" updated successfully!`);
      fetchAlbums();
    } catch (error) {
      console.error("Error updating album:", error);
      setErrorMessage("Failed to update album. Please try again.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-blue-500 mb-4">Edit Album</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="selectAlbum">
            Select Album
          </label>
          <select
            id="selectAlbum"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleAlbumSelect}
            value={selectedAlbum?._id || ""}
          >
            <option value="" disabled>
              -- Select an album --
            </option>
            {albums.length > 0 ? (
              albums.map((album) => (
                <option key={album._id} value={album._id}>
                  {album.nameofalbum}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No albums available
              </option>
            )}
          </select>
        </div>

        {selectedAlbum && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="albumName">
                Album Name
              </label>
              <input
                type="text"
                id="albumName"
                value={albumName}
                onChange={handleAlbumNameChange}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new album name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="uploadImages">
                Add More Images
              </label>
              <input
                type="file"
                id="uploadImages"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Maximum 4MB per image. Up to 20 images in total.
              </p>
            </div>

            {images.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Images</h3>
                <ul className="space-y-2">
                  {images.map((image) => (
                    <li
                      key={image.etag}
                      className="flex justify-between items-center border p-2 rounded"
                    >
                      <img
                        src={image.url}
                        alt="Uploaded"
                        className="w-24 h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.etag)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

            <button
              type="submit"
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="w-full mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? "Processing..." : "Delete Album"}
            </button>
          </>
        )}
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          message={`Are you sure you want to delete the album "${selectedAlbum?.nameofalbum}"?`}
          onConfirm={() => {
            handleAlbumDelete();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default EditAlbums;
