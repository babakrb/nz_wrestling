import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    })
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Access denied'));
  }, []);

  const goToCompetition = () => {
    navigate('/selectcompetition');
  };


  const goToSelectCompetition = () => {
    navigate('/selectcompetition');
  };

  const goToEditCompetition = () => {
    navigate('/EditCompetition');
  };
console.log(`Front=${process.env.REACT_APP_FRONTEND_URL}`);

  return (
    <div className="container my-5">
      <h2>{message}</h2>

      <button
        className="btn btn-primary mt-3"
        onClick={goToCompetition}
      >
        ➕ Competition Management
      </button>

      
    </div>
  );
};

export default Dashboard;
