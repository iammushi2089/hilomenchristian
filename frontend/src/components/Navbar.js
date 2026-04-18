// frontend/src/components/Navbar.js
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar__brand">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            ⚽The <span style={{ color: '#fbbf24' }}>Sports</span>
          </Link>
        </div>
        
        <div className="navbar__links">
          <Link to="/home" className={isActive('/home') ? 'active' : ''}>
            Home
          </Link>
          <Link to="/about" className={isActive('/about') ? 'active' : ''}>
            About Sports
          </Link>
          
          {/* ✅ MOVED HERE: Always visible to everyone */}
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>
            Contact & Resources
          </Link>

          {user ? (
            <>
              <Link to="/create-post" className={isActive('/create-post') ? 'active' : ''}>
                Post
              </Link>
              <Link to="/game" className={isActive('/game') ? 'active' : ''}>
                <span className="game-icon">Game</span> 
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>
                  Admin
                </Link>
              )}
              <Link to="/profile" className={`navbar__user ${isActive('/profile') ? 'active' : ''}`}>
                <img 
                  src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : '/default-avatar.svg'} 
                  alt={user.name} 
                  className="navbar__user-pic"
                />
                <span className="navbar__user-name">{user.name}</span>
              </Link>
              <button className="btn-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login') ? 'active' : ''}>
                Login
              </Link>
              <Link to="/register" className={isActive('/register') ? 'active' : ''}>
                Sign Up
              </Link>
            </>
          )}
          
          <label className="theme-switch">
            <input 
              type="checkbox" 
              checked={isDarkMode} 
              onChange={toggleTheme}
            />
            <span className="slider"></span>
            <span className="theme-icons">
              <span className="sun-icon">☀️</span>
              <span className="moon-icon">🌙</span>
            </span>
          </label>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;