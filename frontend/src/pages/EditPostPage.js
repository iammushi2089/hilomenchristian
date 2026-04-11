// frontend/src/pages/EditPostPage.js
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [post, setPost] = useState(null);

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => {
        const p = res.data;
        setPost(p);
        setTitle(p.title);
        setBody(p.body);
        
        // Check if user can edit this post
        const isOwner = p.author._id === user?._id;
        const isAdmin = user?.role === 'admin';
        if (!isOwner && !isAdmin) {
          setError('You are not authorized to edit this post');
          return;
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load post'));
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await API.put(`/posts/${id}`, { title, body });
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  return (
    <div className="page-container">
      <div className="edit-post-page">
        <h2>Edit Post</h2>
        {error && <p className="error-msg">{error}</p>}
        {!error && post && (
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          </div>
          <div className="form-group">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" rows={10} required />
          </div>
          <button type="submit" className="btn">Update</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPostPage;
