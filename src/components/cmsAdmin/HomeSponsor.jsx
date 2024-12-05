import React, { useState } from 'react';

const HomeSponsor = () => {
  // Static data for sponsors in each section
  const [section1, setSection1] = useState([]);
  const [section2, setSection2] = useState([]);
  const [section3, setSection3] = useState([]);
  const [section4, setSection4] = useState([]);

  // State to track if the dropdown should be visible
  const [showDropdown1, setShowDropdown1] = useState(true);
  const [showDropdown2, setShowDropdown2] = useState(true);
  const [showDropdown3, setShowDropdown3] = useState(true);
  const [showDropdown4, setShowDropdown4] = useState(true);

  // List of all possible sponsors
  const allSponsors = [
    { id: 1, name: 'nike' },
    { id: 2, name: 'puma' },
    { id: 3, name: 'adidas' },
    { id: 4, name: 'bmw' },
  ];

  // Function to remove a sponsor from a section
  const removeSponsor = (section, id) => {
    if (section === 1) {
      setSection1(section1.filter(sponsor => sponsor.id !== id));
      setShowDropdown1(true);
    } else if (section === 2) {
      setSection2(section2.filter(sponsor => sponsor.id !== id));
      setShowDropdown2(true);
    } else if (section === 3) {
      setSection3(section3.filter(sponsor => sponsor.id !== id));
      setShowDropdown3(true);
    } else if (section === 4) {
      setSection4(section4.filter(sponsor => sponsor.id !== id));
      setShowDropdown4(true);
    }
  };

  // Function to handle adding a new sponsor from the dropdown
  const addSponsor = (section, sponsorId) => {
    const sponsor = allSponsors.find(s => s.id === sponsorId);
    if (sponsor) {
      if (section === 1) {
        setSection1([sponsor]); // Only one sponsor in section 1 at a time
        setShowDropdown1(false); // Hide dropdown after adding sponsor
      } else if (section === 2) {
        setSection2([sponsor]); // Only one sponsor in section 2 at a time
        setShowDropdown2(false); // Hide dropdown after adding sponsor
      } else if (section === 3) {
        setSection3([sponsor]); // Only one sponsor in section 3 at a time
        setShowDropdown3(false); // Hide dropdown after adding sponsor
      } else if (section === 4) {
        setSection4([sponsor]); // Only one sponsor in section 4 at a time
        setShowDropdown4(false); // Hide dropdown after adding sponsor
      }
    }
  };

  // Render Sponsor Cards
  const renderSponsors = (section, sponsors) => {
    return sponsors.map(sponsor => (
      <div key={sponsor.id} className="bg-white shadow-lg rounded-lg p-4 mb-4">
        <h3 className="text-xl font-bold text-gray-800">{sponsor.name}</h3>
        <button
          className="mt-2 bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600"
          onClick={() => removeSponsor(section, sponsor.id)}
        >
          Remove
        </button>
      </div>
    ));
  };

  return (
    <div className="py-8 px-4">
      <h2 className="text-center text-3xl font-bold text-blue-500 mb-8">Home Sponsors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Section 1 */}
        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-500 mb-4">Sponsor Section 1</h3>
          {renderSponsors(1, section1)}
          {showDropdown1 && (
            <div className="mb-4">
              <select
                className="w-full bg-gray-100 p-2 rounded-lg border"
                onChange={(e) => addSponsor(1, parseInt(e.target.value))}
              >
                <option value="">Select Sponsor</option>
                {allSponsors.map(sponsor => (
                  <option key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Section 2 */}
        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-500 mb-4">Sponsor Section 2</h3>
          {renderSponsors(2, section2)}
          {showDropdown2 && (
            <div className="mb-4">
              <select
                className="w-full bg-gray-100 p-2 rounded-lg border"
                onChange={(e) => addSponsor(2, parseInt(e.target.value))}
              >
                <option value="">Select Sponsor</option>
                {allSponsors.map(sponsor => (
                  <option key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Section 3 */}
        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-500 mb-4">Sponsor Section 3</h3>
          {renderSponsors(3, section3)}
          {showDropdown3 && (
            <div className="mb-4">
              <select
                className="w-full bg-gray-100 p-2 rounded-lg border"
                onChange={(e) => addSponsor(3, parseInt(e.target.value))}
              >
                <option value="">Select Sponsor</option>
                {allSponsors.map(sponsor => (
                  <option key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Section 4 */}
        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-blue-500 mb-4">Sponsor Section 4</h3>
          {renderSponsors(4, section4)}
          {showDropdown4 && (
            <div className="mb-4">
              <select
                className="w-full bg-gray-100 p-2 rounded-lg border"
                onChange={(e) => addSponsor(4, parseInt(e.target.value))}
              >
                <option value="">Select Sponsor</option>
                {allSponsors.map(sponsor => (
                  <option key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSponsor;
