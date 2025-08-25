import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // اضافه شد

import axios from 'axios';



const EditBracket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const location = useLocation();
const returnPath = location.state?.returnPath || '/dashboard'; // مسیر بازگشت

  const [formData, setFormData] = useState({
    mat: '',
    category: '',
    round: '',
    match: '',
    wrestler1: '',
    wrestler2: '',
    time: '',
    date: '', // ✅ اضافه شده
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/brackets/${id}`)
      .then(res => {
        const data = res.data;
        setFormData({
          ...data,
          date: data.date ? data.date.slice(0, 10) : '' // ✅ تبدیل به فرمت yyyy-mm-dd برای input[type=date]
        });
      })
      .catch(err => {
        console.error('Error fetching bracket:', err);
      });
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/brackets/${id}`, formData)
      //.then(() => navigate('/selectcompetition'))
             .then(() => navigate(returnPath))
         .catch(err => console.error('Error updating bracket:', err));
  };

  //const handleCancel = () => navigate('/selectcompetition');
      const handleCancel = () => navigate(returnPath);


  return (
    <div className="container my-4">
      <h3>Edit Bracket</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Mat:</label>
          <input type="text" className="form-control" name="mat" value={formData.mat} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category:</label>
          <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Match:</label>
          <input type="number" className="form-control" name="match" value={formData.match} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Round:</label>
          <input type="text" className="form-control" name="round" value={formData.round} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Wrestler 1 (Red):</label>
          <input type="text" className="form-control" name="wrestler1" value={formData.wrestler1} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Wrestler 2 (Red):</label>
          <input type="text" className="form-control" name="wrestler2" value={formData.wrestler2} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Time:</label>
          <input type="text" className="form-control" name="time" value={formData.time} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date:</label>
          <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="col-12 d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="btn btn-success">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EditBracket;
