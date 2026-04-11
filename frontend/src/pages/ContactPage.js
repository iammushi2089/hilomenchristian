// frontend/src/pages/ContactPage.js
import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ContactPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');

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
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.message) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('');
    
    try {
      await API.post('/contact', { 
        name: formData.name,
        email: formData.email,
        subject: formData.subject, 
        message: formData.message 
      });
      setStatus('Message sent successfully!');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSubmitted(false);
        setStatus('');
      }, 3000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (!user) {
    return (
      <main className="container">
        <section className="hero fade-in" style={{
          background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/CreamlineCoolSmashers.jpg') center/cover no-repeat",
          borderRadius: '0 0 15px 15px',
        }}>
          <h1>Contact & Resources</h1>
          <p>Get in touch and explore valuable sports resources</p>
        </section>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Please log in to contact us.</p>
        </div>
      </main>
    );
  }

  // Prevent admins from accessing contact page
  if (user.role === 'admin') {
    return (
      <main className="container">
        <section className="hero fade-in" style={{
          background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/CreamlineCoolSmashers.jpg') center/cover no-repeat",
          borderRadius: '0 0 15px 15px',
        }}>
          <h1>Contact & Resources</h1>
          <p>Get in touch and explore valuable sports resources</p>
        </section>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>As an admin, you cannot send contact messages.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero fade-in" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/CreamlineCoolSmashers.jpg') center/cover no-repeat",
        borderRadius: '0 0 15px 15px',
      }}>
        <h1>Contact & Resources</h1>
        <p>Get in touch and explore valuable sports resources</p>
      </section>

      {/* Contact Form */}
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
              <input 
                type="text" 
                id="name" 
                name="name" 
                className={`form-control ${errors.name ? 'error-border' : ''}`}
                value={formData.name}
                onChange={handleChange}
              />
              <span id="nameError" className="error">{errors.name}</span>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address: *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className={`form-control ${errors.email ? 'error-border' : ''}`}
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              <span id="emailError" className="error">{errors.email}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input 
              type="text" 
              id="subject" 
              name="subject" 
              className="form-control"
              placeholder="What is your message about?"
              value={formData.subject}
              onChange={handleChange}
            />
            <span id="subjectError" className="error"></span>
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Your Message: *</label>
            <textarea 
              id="message" 
              name="message" 
              className={`form-control ${errors.message ? 'error-border' : ''}`}
              rows="6"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <span id="messageError" className="error">{errors.message}</span>
          </div>
          
          <button type="submit" className="btn">Send Message</button>
          {submitted && !status.includes('Failed') && <p style={{ color: 'green', marginTop: '1rem' }}>Message sent successfully!</p>}
        </form>
      </section>

      {/* Resources Table */}
      <section className="section">
        <h2>Sports Resources & Tools</h2>
        <p>Here are some of my excellent resources for being a sports enthusiasts:</p>
        
        <table className="resources-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Premier Volleyball League</td>
              <td>Top professional women's volleyball league in the Philippines known for its growing popularity and high-level play.</td>
            </tr>
            <tr>
              <td>Pilipinas Live App</td>
              <td>Comprehensive Filipino streaming app, primarily for Filipinos abroad, offering live & on-demand sports (PBA, UAAP, PVL, FIBA, NBA)</td>
            </tr>
            <tr>
              <td>One Sports</td>
              <td>A major Philippine sports media brand, offering free-to-air TV, digital platforms, and cable channels (like One Sports+), providing extensive coverage of local (PBA, UAAP, PVL) and international sports (NBA, FIBA).</td>
            </tr>
            <tr>
              <td>Rappler Sports</td>
              <td>The sports section of the online news site Rappler, featuring news, features, and videos on key athletes and events.</td>
            </tr>
            <tr>
              <td>MyFitnessPal</td>
              <td>Nutrition tracking app specifically designed for athletes and active individuals</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Map Placeholder */}
      <section>
        <h2>Find Local Sports Facilities</h2>
        <p>Most communities have excellent sports facilities.</p>
        
        <div className="map-container">
          <div className="map-placeholder" style={{
            background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/SportsComplex.jpg') center/cover no-repeat"
          }}>
            <div style={{ textAlign: "center" }}>
              <h3>📍 Community Sports Complex</h3>
              <p>123 Athletic Avenue, Sports City</p>
              <p>Open: 6:00 AM - 10:00 PM Daily</p>
              <p>Facilities: Basketball courts, soccer fields, swimming pool, gym</p>
            </div>
          </div>
          <div className="map-placeholder" style={{
            background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/PublicCourt.jpg') center/cover no-repeat"
          }}>
            <div style={{ textAlign: "center" }}>
              <h3>📍 Villages Public Court</h3>
              <p>456 Players Boulevard, Sport City</p>
              <p>Open: 8:30 AM - 8:00 PM Daily</p>
              <p>Facilities: Basketball courts, volleyball courts</p>
            </div>
          </div>
        </div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.177858804427!2d-73.98784468459418!3d40.70555197933209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a315cdf4c9b%3A0x8b934de5cae6f7a!2sSports%20Complex!5e0!3m2!1sen!2sus!4v1617223763755!5m2!1sen!2sus"
          width="100%" 
          height="400" 
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Sports Complex Map">
        </iframe>
      </section>

      {/* External Links */}
      <section className="section">
        <h2>Recommended External Websites</h2>
        <p>Explore these credible sports organizations and educational sites:</p>
        
        <div className="external-links">
          <a href="https://volleyballphilippines.com/" target="_blank" rel="noopener noreferrer">
            Philippine National Volleyball Federation(PNVF)
          </a>
          <a href="https://en.volleyballworld.com/volleyball/competitions/volleyball-nations-league" target="_blank" rel="noopener noreferrer">
            Volleyball Nations League(VNL)
          </a>
          <a href="https://www.fivb.com/" target="_blank" rel="noopener noreferrer">
            Fédération Internationale de Volleyball(FIVB)
          </a>
        </div>
        
        <p style={{ marginTop: "2rem" }}><strong>Note:</strong> These links open in new tabs and lead to reputable sports organizations that provide valuable information for athletes, coaches, and sports enthusiasts.</p>
      </section>
    </main>
  );
};

export default ContactPage;