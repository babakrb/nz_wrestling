import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import '../App.css'; 





const Navbar = ({ isLoggedIn , onLogout}) => {
  const [active, setActive] = useState('Home');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
    const navigate = useNavigate();

const menus = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  ...(isLoggedIn ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  { name: isLoggedIn ? 'Logout' : 'Login', path: isLoggedIn ? null : '/login' },
];



  const handleClick = (name) => {
    setActive(name);
    setIsCollapsed(true); // بستن منو بعد از کلیک
  };


  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#E8E8E8' }}>

      <div className="container">
        <NavLink className="navbar-brand" to="/">

<img src='/w.png' alt="NZ competition Logo"  width="500" height="80" />

</NavLink>

        {/* همبرگر منو */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`}>
          <ul className="navbar-nav ms-auto">

{menus.map((item) => (
  <li className="nav-item" key={item.name}>
    {item.name === 'Logout' ? (
      <button
        className="nav-link btn btn-link text-start"
        onClick={() => {
          onLogout();             // پاک کردن توکن
          navigate('/login');     // هدایت به صفحه ورود
        }}
        style={{ textDecoration: 'none' }}
      >
        Logout
      </button>
    ) : (
      <NavLink
        to={item.path}
onMouseEnter={(e) => {
  if (active !== item.name) {
    e.target.style.backgroundColor = '#e65100';
    e.target.style.color = '#fff';
  }
}}
onMouseLeave={(e) => {
  if (location.pathname !== item.path && active !== item.name) {
    e.target.style.backgroundColor = 'transparent';
    e.target.style.color = '';
  }
}}

        className={({ isActive }) =>
          `nav-link ${isActive || active === item.name ? 'bg-primary text-white' : ''}`
        }
        onClick={() => handleClick(item.name)}
        onMouseEnter={(e) => {
          if (active !== item.name) e.target.classList.add('bg-primary', 'text-white');
        }}
        onMouseLeave={(e) => {
          if (location.pathname !== item.path && active !== item.name) {
            e.target.classList.remove('bg-primary', 'text-white');
          }
        }}
      >
        {item.name}
      </NavLink>
    )}
  </li>
))}



          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
