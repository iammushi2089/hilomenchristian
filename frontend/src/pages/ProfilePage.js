// frontend/src/pages/ProfilePage.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [pic, setPic] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [accountType, setAccountType] = useState('');
  const [experience, setExperience] = useState('');
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // Helper for Authorization Headers
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchUserPosts = useCallback(async () => {
    if (!user?._id) return;
    try {
      setPostsLoading(true);
      const { data } = await API.get('/posts');
      setUserPosts(data.filter(post => post.author?._id === user._id));
    } catch (err) { 
      console.error('Error fetching posts:', err); 
    } finally { 
      setPostsLoading(false); 
    }
  }, [user?._id]);

  const fetchContactMessages = useCallback(async () => {
    if (!user?._id || user?.role === 'admin') return;
    setLoadingReplies(true);
    try {
      const { data } = await API.get(`/admin/contacts/user/${user._id}`, getAuthHeaders());
      setContactMessages(data);
      const unread = data.filter(c => c.adminReply && !c.adminReply.isRead);
      for (const contact of unread) {
        await API.put(`/admin/contacts/${contact._id}/mark-read`, {}, getAuthHeaders());
      }
    } catch (err) { 
      console.error('Error fetching contact messages:', err); 
    } finally { 
      setLoadingReplies(false); 
    }
  }, [user?._id, user?.role]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await API.get('/auth/me', getAuthHeaders());
        setUsername(data.username || '');
        setEmail(data.email || '');
        setDob(data.dob ? new Date(data.dob).toLocaleDateString() : '');
        setGender(data.gender || '');
        setAccountType(data.accountType || '');
        setExperience(data.experience || '');
        setSports(data.sports || []);
        setName(data.name || '');
        setBio(data.bio || '');
        setLoading(false);
        fetchUserPosts();
        fetchContactMessages();
      } catch (err) { 
        setLoading(false); 
      }
    };
    fetchUserData();
  }, [fetchUserPosts, fetchContactMessages]);

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg(''); setErrorMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    // Backend expects an array or comma-separated string for sports
    fd.append('sports', sports.join(','));

    try {
      const { data } = await API.put('/auth/profile', fd, {
        headers: { 
          ...getAuthHeaders().headers, 
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      // ✅ SUCCESS: Update local and global state so changes reflect immediately
      setUser(data);
      setName(data.name);
      setBio(data.bio);
      
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { 
      setErrorMsg(err.response?.data?.message || 'Update failed. Check image size or backend terminal.'); 
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg(''); setErrorMsg('');
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw }, getAuthHeaders());
      setMsg('Password changed successfully!');
      setCurPw(''); setNewPw('');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) { 
      setErrorMsg('Password change failed.'); 
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${postId}`, getAuthHeaders());
      setUserPosts(userPosts.filter(post => post._id !== postId));
      setMsg('Post deleted successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to delete post.');
    }
  };

  const picSrc = user?.profilePic ? `https://hilomenchristian-backend.onrender.com/uploads/${user.profilePic}` : '/default-avatar.svg';

  const styles = {
    container: { width: '90%', maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#f3f4f6' },
    card: { background: '#111827', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '1px solid #1f2937' },
    tag: { background: '#1D546C', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', marginRight: '8px' },
    replyBox: { background: '#064e3b', padding: '12px', borderRadius: '8px', marginTop: '10px', borderLeft: '4px solid #10b981', color: '#ecfdf5' },
    input: { width: '100%', marginBottom: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #374151', background: '#1f2937', color: '#fff' },
    btn: { padding: '12px 24px', background: '#1D546C', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
    label: { display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '0.9rem' },
    subText: { color: '#9ca3af', margin: '5px 0' }
  };

  if (loading) return <div style={{textAlign:'center', padding:'5rem', color: '#fff'}}>Loading your sports profile...</div>;

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <div style={{display:'flex', alignItems:'center', gap:'25px', flexWrap: 'wrap'}}>
          <img 
            src={picSrc} 
            style={{width:'120px', height:'120px', borderRadius:'50%', objectFit:'cover', border: '3px solid #1D546C'}} 
            alt="Profile" 
          />
          <div>
            <h2 style={{margin:0, fontSize: '2rem'}}>{name}</h2>
            <p style={styles.subText}>@{username} | <span style={{color: '#fbbf24'}}>{accountType}</span></p>
            <p style={styles.subText}>{email}</p>
          </div>
        </div>
      </div>

      {msg && <div style={{background: '#065f46', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '15px'}}>{msg}</div>}
      {errorMsg && <div style={{background: '#991b1b', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '15px'}}>{errorMsg}</div>}

      <div style={styles.card}>
        <h3 style={{color: '#1D546C', marginTop: 0}}>Account Details</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
          <div><span style={styles.label}>Birthday</span><span>{dob}</span></div>
          <div><span style={styles.label}>Gender</span><span>{gender}</span></div>
          <div><span style={styles.label}>Experience</span><span>{experience}</span></div>
          <div>
            <span style={styles.label}>Interests</span>
            <div style={{marginTop:'8px'}}>{sports.map((s,i) => <span key={i} style={styles.tag}>{s}</span>)}</div>
          </div>
        </div>
        <div style={{marginTop: '20px'}}>
            <span style={styles.label}>Bio</span>
            <p style={{margin: 0}}>{bio || 'No bio set yet.'}</p>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={{color: '#1D546C', marginTop: 0}}>My Posts</h3>
        {postsLoading ? <p>Fetching your stories...</p> : userPosts.length === 0 ? <p>No posts yet.</p> : userPosts.map(p => (
          <div key={p._id} style={{padding:'12px 0', borderBottom:'1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Link to={`/posts/${p._id}`} style={{color: '#fff', textDecoration: 'none'}}>{p.title}</Link>
            <button onClick={() => handleDeletePost(p._id)} style={{color:'#ef4444', background: 'none', border: 'none', cursor: 'pointer'}}>Delete</button>
          </div>
        ))}
      </div>

      {user?.role !== 'admin' && (
        <div style={styles.card}>
          <h3 style={{color: '#1D546C', marginTop: 0}}>📬 Admin Replies</h3>
          {loadingReplies ? <p>Checking for replies...</p> : contactMessages.length === 0 ? <p>No messages sent yet.</p> : contactMessages.map(c => (
            <div key={c._id} style={{marginBottom:'20px', padding:'15px', background:'#1f2937', borderRadius:'8px'}}>
              <strong style={{color: '#fbbf24'}}>Subject: {c.subject}</strong>
              <p style={{fontSize: '0.9rem', margin: '10px 0'}}>You: {c.message}</p>
              {c.adminReply && (
                <div style={styles.replyBox}>
                  <strong>Admin Response:</strong> {c.adminReply.body}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem'}}>
        <div style={styles.card}>
          <h3 style={{color: '#1D546C', marginTop: 0}}>Edit Profile</h3>
          <form onSubmit={handleProfile}>
            <label style={styles.label}>Display Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={styles.input} />
            <label style={styles.label}>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} style={{...styles.input, height: '100px'}} />
            <label style={styles.label}>Profile Picture</label>
            <input type="file" onChange={e => setPic(e.target.files[0])} style={{...styles.input, border: 'none', padding: 0}} />
            <button type="submit" style={styles.btn}>Save Changes</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={{color: '#1D546C', marginTop: 0}}>Change Password</h3>
          <form onSubmit={handlePassword}>
            <label style={styles.label}>Current Password</label>
            <input type={showPassword ? "text" : "password"} value={curPw} onChange={e => setCurPw(e.target.value)} style={styles.input} />
            <label style={styles.label}>New Password</label>
            <input type={showPassword ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)} style={styles.input} />
            <label style={{display:'flex', alignItems:'center', gap:'10px', color: '#9ca3af', fontSize: '0.85rem'}}>
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} /> Show Passwords
            </label>
            <button type="submit" style={{...styles.btn, width: '100%', marginTop: '20px'}}>Update Security</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;