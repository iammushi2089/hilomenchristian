// frontend/src/pages/SplashPage.js
import { Link } from 'react-router-dom';

const SplashPage = () => {
  return (
    <div className="splash-page">
      <h1>Welcome to The Folio</h1>
      <p>Share your thoughts, read stories, and join the community.</p>
      <div className="splash-actions">
        <Link className="btn" to="/login">
          Login
        </Link>
        <Link className="btn btn-secondary" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
};

export default SplashPage;
