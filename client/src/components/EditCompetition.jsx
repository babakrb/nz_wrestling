// EditCompetition.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const EditCompetition = () => {
  const [searchParams] = useSearchParams();
   const [existingFile, setExistingFile] = useState('');
  const id = searchParams.get('id');
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [styles, setStyles] = useState([]); // array of styles
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get(`${process.env.BACKEND_URL}/api/competitions/${id}`)
        .then(res => {
          const data = res.data;
		console.log("Current file:", existingFile);
          setTitle(data.title);
          setDate(data.date?.substring(0, 10));
          setLocation(data.location);
          setStyles(data.style || []);
	   setExistingFile(data.adds || '');
        })
        .catch(err => console.error('Fetch failed:', err));
    }
  }, [id]);

  const handleCheckbox = (value) => {
    setStyles(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('style', JSON.stringify(styles));
    if (file) formData.append('file', file);

    try {
      await axios.put(`${process.env.BACKEND_URL}/api/competitions/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      //alert('Competition updated');
      navigate(-1);
    } catch (error) {
      console.error('Error updating:', error);
      alert('Failed to update competition');
    }
  };

  return (
    <div className="container my-4">
      <h3>Edit Competition</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Location:</label>
          <input type="text" className="form-control" value={location} onChange={e => setLocation(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Wrestling style:</label><br />
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="freestyle" value="freestyle" checked={styles.includes('freestyle')} onChange={() => handleCheckbox('freestyle')} />
            <label className="form-check-label" htmlFor="freestyle">Free style</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" id="greco" value="greco-roman" checked={styles.includes('greco-roman')} onChange={() => handleCheckbox('greco-roman')} />
            <label className="form-check-label" htmlFor="greco">Greco-Roman</label>
          </div>
        </div>

        <div className="mb-3">
  <label className="form-label">ADDs file:</label>
  <div className="input-group">
    <input type="file" className="form-control"     onChange={e => setFile(e.target.files[0])} />
  </div>
  {existingFile && (
    <div className="mt-2">
      <a href={`http://localhost:5000/uploads/${existingFile}`} target="_blank" rel="noopener noreferrer">
        View current file: {existingFile}
      </a>
    </div>
  )}
</div>


        

<div className="d-flex">
  <button type="submit" className="btn btn-danger">Save</button>
  <button
    type="button"
    className="btn btn-secondary ms-2"
    onClick={() => navigate(-1)}
  >
    Cancel
  </button>
</div>

      </form>
    </div>
  );
};

export default EditCompetition;
