import React, { useState } from 'react';
import axios from 'axios';

const CreateNewsletter = () => {
  const [formData, setFormData] = useState({
    title: '',
    heading: '',
    date: '',
  });

  const [numSections, setNumSections] = useState(0);
  const [sectionData, setSectionData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumSectionsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count <= 10) {
      setNumSections(count);
      setSectionData(
        Array.from({ length: count }, () => ({ type: '', content: '', image: null }))
      );
    } else {
      setAlert({ type: 'error', message: 'You can select up to 10 sections.' });
    }
  };

  const handleSectionTypeChange = (index, value) => {
    const updatedSections = [...sectionData];
    updatedSections[index].type = value;
    setSectionData(updatedSections);
  };

  const handleContentChange = (index, value) => {
    const updatedSections = [...sectionData];
    updatedSections[index].content = value;
    setSectionData(updatedSections);
  };

  const handleImageChange = (index, file) => {
    const updatedSections = [...sectionData];
    updatedSections[index].image = file;
    setSectionData(updatedSections);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const form = new FormData();
    form.append('title', formData.title);
    form.append('heading', formData.heading);
    form.append('date', formData.date);
  
    // Ensure section data is appended properly
    const processedSectionData = sectionData.map((section) => ({
      text: section.content || '', // Ensure content is always included, even if empty
      photo: section.image ? section.image.name : '', // Only add image name if it exists
    }));
  
    form.append('section', JSON.stringify(processedSectionData));
  
    sectionData.forEach((section, index) => {
      if (section.image) {
        form.append(`photo${index}`, section.image);
      }
    });
  
    try {
      const response = await axios.post(
        ' https://api.gkcc.world/api/newsletter/add',
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      if (response.status === 200) {
        setAlert({ type: 'success', message: 'Newsletter created successfully!' });
        setFormData({ title: '', heading: '', date: '' });
        setNumSections(0);
        setSectionData([]);
      } else {
        setAlert({ type: 'error', message: 'Failed to create the newsletter.' });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-300 rounded-lg p-6 shadow-xl">
      <h2 className="text-center text-3xl font-semibold text-blue-500 mb-4">Create Newsletter</h2>

      {/* Custom Alert */}
      {alert.message && (
        <div className={`border-l-4 p-4 mb-4 ${alert.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
          <span>{alert.message}</span>
          <button onClick={() => setAlert({ type: '', message: '' })} className="text-sm text-gray-600 hover:text-gray-800">✖</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border px-4 py-2" required />
        </div>

        {/* Heading */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Heading</label>
          <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="w-full border px-4 py-2" required />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Publish Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border px-4 py-2" required />
        </div>

        {/* Number of Sections */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Number of Sections</label>
          <select value={numSections} onChange={handleNumSectionsChange} className="w-full border px-4 py-2">
            <option value="">-- Select --</option>
            {[...Array(10)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
          </select>
        </div>

        {/* Sections */}
        {sectionData.map((section, index) => (
          <div key={index} className="mb-4 border-t pt-4">
            <h3 className="text-lg">Section {index + 1}</h3>
            <label className="block text-gray-700 mb-2">Type</label>
            <select
              value={section.type}
              onChange={(e) => handleSectionTypeChange(index, e.target.value)}
              className="w-full border px-4 py-2 mb-4"
            >
              <option value="">-- Select --</option>
              <option value="paragraph">Paragraph</option>
              <option value="image">Image</option>
              <option value="both">Both</option>
            </select>

            {/* Conditional Rendering based on type */}
            {section.type.includes('paragraph') && (
              <textarea
                placeholder="Enter paragraph"
                value={section.content}
                onChange={(e) => handleContentChange(index, e.target.value)}
                rows="3"
                className="w-full border px-4 py-2 mb-4"
              />
            )}
            {section.type.includes('image') && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
                className="w-full border px-4 py-2"
              />
            )}
            {section.type.includes('both') && (
              <>
                <textarea
                  placeholder="Enter paragraph"
                  value={section.content}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  rows="3"
                  className="w-full border px-4 py-2 mb-4"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(index, e.target.files[0])}
                  className="w-full border px-4 py-2"
                />
              </>
            )}
          </div>
        ))}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
          {isSubmitting ? 'Submitting...' : 'Create Newsletter'}
        </button>
      </form>
    </div>
  );
};

export default CreateNewsletter;
