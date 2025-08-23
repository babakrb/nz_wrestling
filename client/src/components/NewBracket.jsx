// src/components/NewBracket.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewBracket = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mat: '',
    category: '',
    match: '',
    round: '',
    wrestler1: '',
    wrestler2: '',
    time: '',
    date: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.BACKEND_URL}/api/brackets`, {
        ...form,
        competitionId,
      });
      navigate(`/ViewBrackets/${competitionId}`);
    } catch (err) {
      alert('❌ Failed to create bracket');
      console.error(err);
    }
  };

  return (
    <div className="container my-4">
      <h3>Create New Bracket</h3>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Mat:</label>
            <input type="text" className="form-control" name="mat" value={form.mat} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Category:</label>
            <input type="text" className="form-control" name="category" value={form.category} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Match:</label>
            <input type="number" className="form-control" name="match" value={form.match} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Round:</label>
            <input type="text" className="form-control" name="round" value={form.round} onChange={handleChange} />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Wrestler 1 (Red):</label>
          <input type="text" className="form-control" name="wrestler1" value={form.wrestler1} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Wrestler 2 (Red):</label>
          <input type="text" className="form-control" name="wrestler2" value={form.wrestler2} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Time:</label>
          <input type="text" className="form-control" name="time" value={form.time} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Date:</label>
           <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} />
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-danger">Save</button>
        </div>
      </form>
    </div>
  );
};

export default NewBracket;
