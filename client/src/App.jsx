import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Table from './components/Table';
import Dashboard from './components/Dashboard';
import Aboutus from './components/AboutUs';
import Login from './components/Login';
import Home from './components/Home';
import axios from 'axios';
import NewCompetition from './components/NewCompetition';
import Bracket from './components/Bracket';
import SelectCompetition from './components/SelectCompetition';
import ViewBrackets from './components/ViewBrackets';
import EditBracket from './components/EditBracket';
import DeleteBracket from './components/DeleteBracket';
import EditCompetition from './components/EditCompetition';
import NewBracket from './components/NewBracket';
import EditResult from './components/EditResult';
import Register from './components/Register';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);

  // 🔒 بررسی اعتبار توکن هنگام شروع برنامه
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
		console.log("Token:", token);
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/dashboard` {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        // توکن نامعتبر → حذف شود
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    };

    checkToken();
  }, []);

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/new" element={<NewCompetition />} />
        <Route path="/bracket/:id" element={<Bracket />} />
        <Route path="/selectcompetition" element={<SelectCompetition />} />
        <Route path="/editbracket/:id" element={<EditBracket />} />
        <Route path="/deletebracket/:id" element={<DeleteBracket />} />
        <Route path="/viewbrackets/:id" element={<ViewBrackets />} />
	      <Route path="/editcompetition" element={<EditCompetition />} />
        <Route path="/editresult/:id" element={<EditResult />} />
        <Route path="/newbracket/:competitionId" element={<NewBracket />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;
