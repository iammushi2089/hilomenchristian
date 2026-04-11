// frontend/src/pages/SecurityQuestionPage.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';

const SecurityQuestionPage = () => {
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get the reset token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const question = params.get('question');
    if (token && question) {
      setResetToken(token);
      setSecurityQuestion(decodeURIComponent(question));
    } else {
      setError('Invalid reset request. Please try again.');
    }
  }, [location]);

  const handleVerifyAnswer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await API.post('/auth/verify-security', {
        resetToken: resetToken,
        securityAnswer: securityAnswer
      });
      
      setIsVerified(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // First, verify security answer again to get password reset token
      const verifyResponse = await API.post('/auth/verify-security', {
        resetToken: resetToken,
        securityAnswer: securityAnswer
      });
      
      // Then reset the password
      await API.post('/auth/reset-password', {
        token: verifyResponse.data.passwordResetToken,
        newPassword: newPassword
      });
      
      alert('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '50px auto',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    },
    title: {
      color: '#1D546C',
      textAlign: 'center',
      marginBottom: '20px'
    },
    questionBox: {
      backgroundColor: '#f0f8ff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    questionText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1D546C',
      marginBottom: '10px'
    },
    question: {
      fontSize: '16px',
      color: '#333'
    },
    formGroup: {
      marginBottom: '20px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#1D546C',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px'
    },
    errorMsg: {
      color: '#dc3545',
      padding: '10px',
      marginBottom: '20px',
      textAlign: 'center',
      backgroundColor: '#f8d7da',
      borderRadius: '5px'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      marginTop: '10px'
    }
  };

  if (!isVerified) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Security Verification</h2>
        <div style={styles.questionBox}>
          <p style={styles.questionText}>Security Question:</p>
          <p style={styles.question}>{securityQuestion}</p>
        </div>
        
        {error && <p style={styles.errorMsg}>{error}</p>}
        
        <form onSubmit={handleVerifyAnswer}>
          <div style={styles.formGroup}>
            <input
              type="text"
              placeholder="Enter your answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Answer'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reset Your Password</h2>
      
      {error && <p style={styles.errorMsg}>{error}</p>}
      
      <form onSubmit={handleResetPassword}>
        <div style={styles.formGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password (min 6 characters)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default SecurityQuestionPage;