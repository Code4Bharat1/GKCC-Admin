import React, { useState } from 'react';

const ViewSponsor = () => {
  // Example data to display
  const [sponsors, setSponsors] = useState([
    {
      id: 1,
      name: 'Kokan Welfare Society',
      description: 'Leading provider of innovative tech solutions.',
      logo: 'https://via.placeholder.com/100', // Example logo URL
      brochure: 'https://example.com/brochure.pdf', // Example brochure URL
      link: 'https://www.techcorp.com',
    },
    {
      id: 2,
      name: 'Emirates Kokan Committee',
      description: 'Sustainability-focused company.',
      logo: 'https://via.placeholder.com/100', // Example logo URL
      brochure: 'https://example.com/brochure.pdf', // Example brochure URL
      link: 'https://www.greenplanet.com',
    },
  ]);

  // State to track editing
  const [editingId, setEditingId] = useState(null);

  // Handler for saving edits
  const handleSave = (id, updatedSponsor) => {
    setSponsors((prevSponsors) =>
      prevSponsors.map((sponsor) => (sponsor.id === id ? updatedSponsor : sponsor))
    );
    setEditingId(null); // Exit editing mode
  };

  return (
    <div className="bg-white min-h-screen py-8">
      <h2 className="text-center text-3xl font-bold text-blue-500 mb-8">View Sponsors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {sponsors.map((sponsor) =>
          editingId === sponsor.id ? (
            <div
              key={sponsor.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Editing Form */}
              <div className="p-4">
                {/* Name */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={sponsor.name}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => (sponsor.name = e.target.value)}
                />
                {/* Description */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  defaultValue={sponsor.description}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 h-24"
                  onChange={(e) => (sponsor.description = e.target.value)}
                />
                {/* Logo Upload */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => (sponsor.logo = URL.createObjectURL(e.target.files[0]))}
                />
                {/* Brochure Upload */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Brochure</label>
                <input
                  type="file"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => (sponsor.brochure = URL.createObjectURL(e.target.files[0]))}
                />
                {/* Link */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Link</label>
                <input
                  type="url"
                  defaultValue={sponsor.link}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                  onChange={(e) => (sponsor.link = e.target.value)}
                />
                {/* Save Button */}
                <button
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => handleSave(sponsor.id, sponsor)}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              key={sponsor.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Logo */}
              <div className="p-4 bg-blue-500 flex justify-center items-center">
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="w-52 h-36 object-cover rounded-lg border-4 border-white"
                />
              </div>
              {/* Content */}
              <div className="p-4">
                {/* Name */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{sponsor.name}</h3>
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{sponsor.description}</p>
                {/* Brochure */}
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Brochure: </span>
                  <a
                    href={sponsor.brochure}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View
                  </a>
                </div>
                {/* Link */}
                <div>
                  <span className="font-medium text-gray-700">Website: </span>
                  <a
                    href={sponsor.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Visit
                  </a>
                </div>
                {/* Edit Button */}
                <button
                  className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => setEditingId(sponsor.id)}
                >
                  Edit
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ViewSponsor;
