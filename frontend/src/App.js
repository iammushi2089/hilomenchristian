// frontend/src/App.js
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; 
import SplashPage from './pages/SplashPage'; 
import HomePage from './pages/HomePage'; 
import AboutPage from './pages/AboutPage'; 
import PostPage from './pages/PostPage'; 
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage'; 
import ProfilePage from './pages/ProfilePage'; 
import CreatePostPage from './pages/CreatePostPage'; 
import EditPostPage from './pages/EditPostPage'; 
import AdminPage from './pages/AdminPage'; 
import ContactPage from './pages/ContactPage';
import GamePage from './pages/GamePage';
import SecurityQuestionPage from './pages/SecurityQuestionPage';

function App() { 
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          {/* Public routes — anyone can visit */}
          <Route path='/' element={<SplashPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/posts/:id' element={<PostPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/reset-password" element={<SecurityQuestionPage />} />
          
          {/* Protected routes — must be logged in */}
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/create-post' element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path='/edit-post/:id' element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
          <Route path='/contact' element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />

          {/* Admin only — redirects members/guests to home */}
          <Route path='/admin' element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;