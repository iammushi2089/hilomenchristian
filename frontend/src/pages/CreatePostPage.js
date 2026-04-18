// frontend/src/pages/CreatePostPage.js 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';     
import API from '../api/axios';

const CreatePostPage = () => { 
  const [title, setTitle] = useState(''); 
  const [body, setBody] = useState('');  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(''); 
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setError(''); 
    
    if (!title.trim() || !body.trim()) {
      setError('Please provide both title and content');
      return;
    }

    setIsUploading(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);  
    if (image) fd.append('image', image);
    
    try {
      // ✅ Explicitly grab the token
      const token = localStorage.getItem('token');
      
      // ✅ Force the token and multipart header into the request
      const { data } = await API.post('/posts', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      navigate(`/posts/${data._id}`);
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to publish post'); 
    } finally {
      setIsUploading(false);
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
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    },
    createPostCard: {
      background: 'var(--card-bg)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    h2: {
      color: 'var(--primary-color)',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      color: 'var(--text)'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid var(--muted-border)',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'var(--card-bg)',
      color: 'var(--text)'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid var(--muted-border)',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      background: 'var(--card-bg)',
      color: 'var(--text)',
      resize: 'vertical'
    },
    imagePreviewContainer: {
      marginTop: '0.5rem',
      textAlign: 'center'
    },
    imagePreview: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: '8px',
      border: '1px solid var(--muted-border)'
    },
    removeImageBtn: {
      marginTop: '0.5rem',
      padding: '0.25rem 0.75rem',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    btn: {
      width: '100%',
      padding: '0.8rem 2rem',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    btnDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    errorMsg: {
      color: '#dc3545',
      background: '#f8d7da',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px',
      textAlign: 'center'
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.hero} className="fade-in">
        <h1 style={styles.heroH1}>Create a <span style={{ color: 'yellow' }}>New Post</span></h1>
        <p style={styles.heroP}>Share your sports stories, experiences, and insights with the community</p>
      </section>

      <div style={styles.pageContainer}>
        <div style={styles.createPostCard}>
          <h2 style={styles.h2}>Write a New Post</h2>
          {error && <p style={styles.errorMsg}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Post Title</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder='Enter your post title...' 
                required 
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Post Content</label>
              <textarea 
                value={body} 
                onChange={e => setBody(e.target.value)} 
                placeholder='Write your post here...' 
                rows={12} 
                required 
                style={styles.textarea}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Upload Image (Optional):</label>
              <input 
                type='file' 
                accept='image/*' 
                onChange={handleImageChange}
                style={styles.input}
              />
              
              {imagePreview && (
                <div style={styles.imagePreviewContainer}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={styles.imagePreview} 
                  />
                  <br />
                  <button 
                    type="button"
                    style={styles.removeImageBtn}
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            
            <button 
              type='submit' 
              style={{
                ...styles.btn,
                ...(isUploading ? styles.btnDisabled : {})
              }}
              disabled={isUploading}
            >
              {isUploading ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}; 

export default CreatePostPage;