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

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    API.get(`/posts/${id}`)
      .then((res) => {
        const p = res.data;
        setPost(p);
        setTitle(p.title);
        setBody(p.body);
        
        const isOwner = p.author?._id === user?._id;
        const isAdmin = user?.role === 'admin';
        if (!isOwner && !isAdmin) {
          setError('You are not authorized to edit this post');
        }
      })
      .catch(() => setError('Failed to load post data'));
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/posts/${id}`, { title, body }, getAuthHeaders());
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  return (
    <div className="page-container" style={{padding: '5rem 2rem', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
        <h2>Edit Post</h2>
        {error && <p style={{color: 'red', background: '#f8d7da', padding: '10px'}}>{error}</p>}
        {!error && post && (
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontWeight: 'bold'}}>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} style={{width: '100%', padding: '10px'}} required />
            </div>
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', fontWeight: 'bold'}}>Content</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} style={{width: '100%', padding: '10px'}} required />
            </div>
            <button type="submit" style={{padding: '10px 20px', backgroundColor: '#1D546C', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Update Post</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPostPage;