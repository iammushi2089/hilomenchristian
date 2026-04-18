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
        
        {/* Adjusted Brand/Logo */}
        <div className="navbar__brand">
          <Link to="/" className="brand-link">
             <span className="brand-icon">⚽</span>
             <span className="brand-text">
               The <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Sports</span>
             </span>
          </Link>
        </div>
        
        <div className="navbar__links">
          <div className="nav-main-links">
            <Link to="/home" className={isActive('/home') ? 'active' : ''}>Home</Link>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>About Sports</Link>
            <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>Contact & Resources</Link>
            {user && (
              <>
                <Link to="/create-post" className={isActive('/create-post') ? 'active' : ''}>Post</Link>
                <Link to="/game" className={isActive('/game') ? 'active' : ''}>Game</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>Admin</Link>
                )}
              </>
            )}
          </div>

          <div className="nav-user-section">
            {user ? (
              <>
                <Link to="/profile" className={`navbar__user ${isActive('/profile') ? 'active' : ''}`}>
                  <img 
                    src={user.profilePic ? `https://hilomenchristian-backend.onrender.com/uploads/${user.profilePic}` : '/default-avatar.svg'} 
                    alt={user.name} 
                    className="navbar__user-pic"
                  />
                  <span className="navbar__user-name">{user.name}</span>
                </Link>
                <button className="btn-link logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className={isActive('/login') ? 'active' : ''}>Login</Link>
                <Link to="/register" className={`register-btn ${isActive('/register') ? 'active' : ''}`}>Sign Up</Link>
              </div>
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
      </div>
    </nav>
  );
};

export default Navbar;