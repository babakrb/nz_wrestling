import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditResult = () => {
  const { id } = useParams(); // Bracket ID
  const navigate = useNavigate();

  const [form, setForm] = useState({
    match: '',
    wrestler1: '',
    wrestler2: '',
    winner: '',
    winMethod: 'Decision',
    score: '',
    wrt1Point: '',
    wrt2Point: '',
  });

  useEffect(() => {
    fetchBracket();
  }, []);

  const fetchBracket = async () => {
    try {
      const res = await axios.get(`${process.env.BACKEND_URL}/api/brackets/${id}`);
    

      const data = res.data;
      console.log('Bracket data from server:', data);
      setForm({
        match: data.match,
        wrestler1: data.wrestler1,
        wrestler2: data.wrestler2,
        winner: data.winner || '',
        winMethod: data.winMethod || 'Decision',
        score: data.score || '',
        wrt1Point: data.wrt1Point?.toString() || '',
wrt2Point: data.wrt2Point?.toString() || '',

      });
    } catch (err) {
      console.error('Failed to fetch bracket', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.BACKEND_URL}/api/brackets/${id}`, form);
      navigate(-1);
    } catch (err) {
      console.error('Failed to update result', err);
      alert('❌ Failed to save changes');
    }
  };

  return (
    <div className="container my-4">
      <h3>Edit Result</h3>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Match:</label>
            <input type="number" className="form-control" name="match" value={form.match} disabled />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Wrestler 1 (Red):</label>
          <input type="text" className="form-control" name="wrestler1" value={form.wrestler1} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">Wrestler 2 (Blue):</label>
          <input type="text" className="form-control" name="wrestler2" value={form.wrestler2} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">Winner:</label>
          <input type="text" className="form-control" name="winner" value={form.winner} onChange={handleChange} required />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Winning Method:</label>
            <select className="form-select" name="winMethod" value={form.winMethod} onChange={handleChange}>
              <option>Technical Fall</option>
              <option>Decision</option>
              <option>Default</option>
              <option>Disqualification</option>
              <option>Injury</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Score:</label>
            <input type="text" className="form-control" name="score" value={form.score} onChange={handleChange} />
          </div>

          <div className="col-md-6 mt-3">
            <label className="form-label">Red Points:</label>
            <input type="text" className="form-control" name="wrt1Point" value={form.wrt1Point} onChange={handleChange} />
          </div>

          <div className="col-md-6 mt-3">
            <label className="form-label">Blue Points:</label>
            <input type="text" className="form-control" name="wrt2Point" value={form.wrt2Point} onChange={handleChange} />
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-danger">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditResult;
