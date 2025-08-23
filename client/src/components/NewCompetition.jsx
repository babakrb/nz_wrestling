import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const NewCompetition = () => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    status: 'Upcoming',
    style: [],
  });
const navigate = useNavigate(); 
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'style') {
      setForm((prev) => ({
        ...prev,
        style: checked
          ? [...prev.style, value]
          : prev.style.filter((s) => s !== value),
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('date', form.date);
    formData.append('location', form.location);
    formData.append('status', form.status);
    formData.append('style', JSON.stringify(form.style));
    if (file) {
      formData.append('file', file);
    }

    try {
      await axios.post(`${process.env.BACKEND_URL}/api/competitions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Competition added successfully!');
      setForm({
        title: '',
        date: '',
        location: '',
        status: 'Upcoming',
        style: [],
      });
      setFile(null);
    } catch (error) {
      setMessage('❌ Failed to add competition. ' + error);
    }
  };

  return (
    <div className="container my-5">
      <h2>Add New Competition</h2>
      {message && <div className="alert alert-info">{message}</div>}

<div className="mb-3">
  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => navigate('/selectcompetition')}
  >
    ← Back to Competitions
  </button>
</div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" name="title" className="form-control" value={form.title} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Date</label>
          <input type="date" name="date" className="form-control" value={form.date} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input type="text" name="location" className="form-control" value={form.location} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select name="status" className="form-select" value={form.status} onChange={handleChange}>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Wrestling Style</label>
          <div className="form-check">
            <input
              type="checkbox"
              name="style"
              value="freestyle"
              className="form-check-input"
              checked={form.style.includes('freestyle')}
              onChange={handleChange}
            />
            <label className="form-check-label">Freestyle</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              name="style"
              value="greco-roman"
              className="form-check-input"
              checked={form.style.includes('greco-roman')}
              onChange={handleChange}
            />
            <label className="form-check-label">Greco-Roman</label>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">ADDs file</label>
          <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button type="submit" className="btn btn-danger">Save</button>
      </form>
    </div>
  );
};

export default NewCompetition;
