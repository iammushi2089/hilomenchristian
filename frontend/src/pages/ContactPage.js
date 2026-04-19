// frontend/src/pages/ContactPage.js
import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext'; // ✅ Added Auth Context

const ContactPage = () => {
  const { user } = useAuth(); // ✅ Get the current user
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');

  // ✅ Auto-fill the form if the user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    
    if (!formData.email) newErrors.email = "Email is required";
    else if (!isValidEmail(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.message) newErrors.message = "Message is required";
    else if (formData.message.length < 10) newErrors.message = "Message must be at least 10 characters";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('');
    
    try {
      // ✅ Grab the token if it exists
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // ✅ Send the token along with the request
      await API.post('/contact', { 
        name: formData.name,
        email: formData.email,
        subject: formData.subject, 
        message: formData.message
      }, config);
      
      setStatus('Message sent successfully!');
      
      // ✅ Reset form, but keep name/email if user is logged in
      setFormData({ 
        name: user ? user.name : '', 
        email: user ? user.email : '', 
        subject: '', 
        message: '' 
      });
      
      setTimeout(() => {
        setStatus('');
      }, 3000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <main className="container">
      <section className="hero fade-in" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/CreamlineCoolSmashers.jpg') center/cover no-repeat",
        borderRadius: '0 0 15px 15px',
      }}>
        <h1>Contact & Resources</h1>
        <p>Get in touch and explore valuable sports resources</p>
      </section>

      <section>
        <h2>Contact Form</h2>
        <p>Have questions about sports, specifically volleyball? Want to share your experiences? Send me a message!</p>
        
        {status && (
          <p className={status.includes('successfully') ? 'success-msg' : 'error-msg'}>
            {status}
          </p>
        )}
        
        <form className="contact-form" id="contactForm" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name: *</label>
              <input type="text" id="name" name="name" className={`form-control ${errors.name ? 'error-border' : ''}`} value={formData.name} onChange={handleChange} readOnly={!!user} style={user ? {backgroundColor: '#f1f5f9', cursor: 'not-allowed'} : {}} />
              <span id="nameError" className="error">{errors.name}</span>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address: *</label>
              <input type="email" id="email" name="email" className={`form-control ${errors.email ? 'error-border' : ''}`} placeholder="example@email.com" value={formData.email} onChange={handleChange} readOnly={!!user} style={user ? {backgroundColor: '#f1f5f9', cursor: 'not-allowed'} : {}} />
              <span id="emailError" className="error">{errors.email}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input type="text" id="subject" name="subject" className="form-control" placeholder="What is your message about?" value={formData.subject} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message: *</label>
            <textarea id="message" name="message" className={`form-control ${errors.message ? 'error-border' : ''}`} rows="6" value={formData.message} onChange={handleChange}></textarea>
            <span id="messageError" className="error">{errors.message}</span>
          </div>
          
          <button type="submit" className="btn">Send Message</button>
        </form>
      </section>
    </main>
  );
};

export default ContactPage;