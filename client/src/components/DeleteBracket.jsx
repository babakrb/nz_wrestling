import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
//import 'bootstrap/dist/css/bootstrap.min.css';

const DeleteBracket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bracket, setBracket] = useState(null);

  useEffect(() => {
    const fetchBracket = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/brackets/${id}`);
        setBracket(res.data);
      } catch (err) {
        console.error('Failed to fetch bracket', err);
      }
    };
    fetchBracket();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/brackets/${id}`);
      navigate(-1); // بازگشت به صفحه قبلی
    } catch (err) {
      console.error('Error deleting bracket:', err);
    }
  };

  if (!bracket) return <div className="text-center my-4">Loading...</div>;

  return (
    <div className="container my-4">
      <h4>Are you sure you want to delete this bracket?</h4>
      <div className="card p-3 my-3">
        <p><strong>Mat:</strong> {bracket.mat}</p>
        <p><strong>Category:</strong> {bracket.category}</p>
        <p><strong>Round:</strong> {bracket.round}</p>
        <p><strong>Match:</strong> {bracket.match}</p>
        <p><strong>Wrestler 1 (Red):</strong> {bracket.wrestler1}</p>
        <p><strong>Wrestler 2 (Red):</strong> {bracket.wrestler2}</p>
        <p><strong>Time:</strong> {bracket.time}</p>
        <p><strong>Date:</strong> {new Date(bracket.date).toLocaleDateString()}</p>
      </div>
      <div className="d-flex justify-content-between">
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteBracket;
