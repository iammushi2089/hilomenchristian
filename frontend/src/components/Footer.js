// frontend/src/components/Footer.js

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <p>📧 Email: tianhilomen@gmail.com</p>
              <p>📞 Phone: (555) 123-4567</p>
              <p>📍 Address: 123 Sports Avenue, Athletic City</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 The Folio. All rights reserved.</p>
          <p>Share your thoughts, read stories, and join the community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;