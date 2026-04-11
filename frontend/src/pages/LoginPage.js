// frontend/src/pages/LoginPage.js  
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const LoginPage = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try { 
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) { 
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setResetError('');
    setLoading(true);
    
    try {
      const response = await API.post('/auth/forgot-password', { email: resetEmail });
      
      // Check if the response requires security question
      if (response.data.requiresSecurityQuestion) {
        // Close the modal first
        setForgotPassword(false);
        setResetEmail('');
        setResetMessage('');
        
        // Navigate to security question page with token and question
        navigate(`/reset-password?token=${response.data.resetToken}&question=${encodeURIComponent(response.data.securityQuestion)}`);
      } else {
        // This is for the old email flow (fallback)
        setResetMessage(response.data.message);
        setTimeout(() => {
          setForgotPassword(false);
          setResetEmail('');
          setResetMessage('');
        }, 3000);
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      width: '90%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    hero: {
      color: 'white',
      textAlign: 'center',
      padding: '6rem 2rem',
      marginBottom: '3rem',
      borderRadius: '0 0 15px 15px',
      background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/LaSalle.jpg') center/cover no-repeat"
    },
    heroH1: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
      color: 'white'
    },
    heroP: {
      fontSize: '1.2rem',
      maxWidth: '700px',
      margin: '0 auto 2rem',
      opacity: 0.9
    },
    pageContainer: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '2rem'
    },
    loginPage: {
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    h2: {
      color: 'var(--primary-color, #1D546C)',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'var(--card-bg, #ffffff)',
      color: 'var(--text, #111827)'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      marginTop: '0.5rem'
    },
    btn: {
      width: '100%',
      padding: '0.8rem 2rem',
      backgroundColor: '#1D546C',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    forgotPasswordLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '1rem',
      color: '#1D546C',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    link: {
      color: '#1D546C',
      textDecoration: 'none'
    },
    errorMsg: {
      color: '#dc3545',
      background: '#f8d7da',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    successMsg: {
      color: 'green',
      background: '#d4edda',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '16px',
      padding: '2rem',
      maxWidth: '400px',
      width: '90%',
      position: 'relative'
    },
    modalH3: {
      color: 'var(--primary-color, #1D546C)',
      marginBottom: '1rem'
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#666'
    },
    loadingText: {
      textAlign: 'center',
      marginTop: '1rem'
    }
  };

  return (
    <main style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero} className='fade-in'>
        <h1 style={styles.heroH1}>Welcome Back to <span style={{ color: 'yellow' }}>The Sports</span></h1>
        <p style={styles.heroP}>Login to access your account and continue your sports journey</p>
      </section>

      <div style={styles.pageContainer}>
        <div style={styles.loginPage}>
          <h2 style={styles.h2}>Login to TheFolio</h2>
          
          {error && <p style={styles.errorMsg}>{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <input 
                type='email' 
                placeholder='Email address' 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder='Password' 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={showPassword} 
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Show password</span>
            </div>
            
            <button type='submit' style={styles.btn}>Login</button>
          </form>
          
          <div style={styles.forgotPasswordLink} onClick={() => setForgotPassword(true)}>
            Forgot password?
          </div>
          
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don't have an account? <Link to='/register' style={styles.link}>Register here</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPassword && (
        <div style={styles.modalOverlay} onClick={() => setForgotPassword(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setForgotPassword(false)}>×</button>
            <h3 style={styles.modalH3}>Reset Password</h3>
            <p>Enter your email address and we'll send you instructions to reset your password.</p>
            
            {resetMessage && <p style={styles.successMsg}>{resetMessage}</p>}
            {resetError && <p style={styles.errorMsg}>{resetError}</p>}
            
            <form onSubmit={handleForgotPassword}>
              <div style={styles.formGroup}>
                <input 
                  type='email' 
                  placeholder='Enter your email address' 
                  value={resetEmail} 
                  onChange={e => setResetEmail(e.target.value)} 
                  required
                  style={styles.input}
                />
              </div>
              <button 
                type='submit' 
                style={styles.btn}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}; 

export default LoginPage;