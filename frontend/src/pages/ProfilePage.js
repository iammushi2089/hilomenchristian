// frontend/src/pages/ProfilePage.js - Fixed version

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
  
  // Additional user data from registration
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [accountType, setAccountType] = useState('');
  const [experience, setExperience] = useState('');
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For user's posts
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  
  // For contact messages with admin replies
  const [contactMessages, setContactMessages] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // Fetch user's posts
  const fetchUserPosts = useCallback(async () => {
    if (!user?._id) return;
    
    try {
      setPostsLoading(true);
      const { data } = await API.get('/posts');
      const myPosts = data.filter(post => post.author?._id === user._id);
      setUserPosts(myPosts);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setPostsLoading(false);
    }
  }, [user?._id]);

  // Fetch contact messages with replies - FIXED dependency
  const fetchContactMessages = useCallback(async () => {
  if (!user?._id || user?.role === 'admin') return;
  
  setLoadingReplies(true);
  try {
    console.log('Fetching contacts for user ID:', user._id);
    const { data } = await API.get(`/admin/contacts/user/${user._id}`);
    console.log('Contacts data received:', data);
    setContactMessages(data);
    
    // Mark unread replies as read
    const unreadReplies = data.filter(c => c.adminReply && !c.adminReply.isRead);
    console.log('Unread replies found:', unreadReplies.length);
    for (const contact of unreadReplies) {
      await API.put(`/admin/contacts/${contact._id}/mark-read`);
    }
  } catch (err) {
    console.error('Error fetching contact messages:', err.response?.data || err.message);
  } finally {
    setLoadingReplies(false);
  }
}, [user?._id, user?.role]);

  // Fetch full user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const { data } = await API.get('/auth/me');
        console.log('Fetched user data:', data);
        
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
        console.error('Error fetching user data:', err.response?.data);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [fetchUserPosts, fetchContactMessages]);

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating profile');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setErrorMsg('');
    try {
      await API.put('/auth/change-password', { 
        currentPassword: curPw,
        newPassword: newPw 
      });
      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error changing password');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await API.delete(`/posts/${postId}`);
      setUserPosts(userPosts.filter(post => post._id !== postId));
      setMsg('Post deleted successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to delete post');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const picSrc = user?.profilePic
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : '/default-avatar.svg';

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
      background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/CCSwJia.jpg') center/cover no-repeat",
      transition: 'background 0.3s ease'
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
    profileContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0 0 2rem 0'
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      marginBottom: '2rem',
      padding: '2rem',
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      flexWrap: 'wrap'
    },
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '4px solid var(--primary-color, #1D546C)'
    },
    profileInfo: {
      flex: 1
    },
    profileName: {
      margin: 0,
      color: 'var(--primary-color, #1D546C)',
      fontSize: '2rem'
    },
    profileUsername: {
      margin: '5px 0',
      color: 'var(--text, #111827)',
      fontSize: '1rem'
    },
    profileEmail: {
      margin: '5px 0',
      color: 'var(--text, #111827)',
      fontSize: '0.9rem'
    },
    card: {
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    cardTitle: {
      color: 'var(--primary-color, #1D546C)',
      marginBottom: '1.5rem',
      borderBottom: '2px solid var(--primary-color, #1D546C)',
      paddingBottom: '0.5rem',
      fontSize: '1.5rem'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem'
    },
    infoItem: {
      padding: '0.5rem'
    },
    infoLabel: {
      fontWeight: 'bold',
      color: 'var(--primary-color, #1D546C)',
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.9rem'
    },
    infoValue: {
      color: 'var(--text, #111827)',
      fontSize: '1rem'
    },
    sportsList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    sportTag: {
      background: 'var(--primary-color, #1D546C)',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      fontWeight: 'bold',
      display: 'block',
      marginBottom: '0.5rem',
      color: 'var(--text, #111827)'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      background: 'var(--card-bg, #ffffff)',
      color: 'var(--text, #111827)'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      background: 'var(--card-bg, #ffffff)',
      color: 'var(--text, #111827)'
    },
    btn: {
      display: 'inline-block',
      padding: '0.8rem 2rem',
      backgroundColor: '#1D546C',
      color: 'white',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    btnSmall: {
      padding: '0.4rem 1rem',
      fontSize: '0.875rem',
      marginLeft: '0.5rem'
    },
    btnDanger: {
      backgroundColor: '#dc3545'
    },
    successMsg: {
      color: 'green',
      background: '#d4edda',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px'
    },
    errorMsg: {
      color: '#dc3545',
      background: '#f8d7da',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px'
    },
    checkboxLabel: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      marginTop: '10px'
    },
    loadingText: {
      textAlign: 'center',
      padding: '3rem',
      fontSize: '1.2rem',
      color: 'var(--text, #111827)'
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginTop: '1rem'
    },
    postCard: {
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease'
    },
    postImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover'
    },
    postContent: {
      padding: '1rem'
    },
    postTitle: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: 'var(--primary-color, #1D546C)'
    },
    postExcerpt: {
      fontSize: '0.9rem',
      color: 'var(--text, #111827)',
      marginBottom: '1rem',
      lineHeight: '1.4'
    },
    postDate: {
      fontSize: '0.75rem',
      color: '#666',
      marginBottom: '0.5rem'
    },
    postActions: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '0.5rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem',
      color: '#666'
    }
  };

  const contactRepliesStyles = {
    contactCard: {
      background: 'var(--card-bg, #ffffff)',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '1rem',
      borderLeft: '4px solid #1D546C'
    },
    contactSubject: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#1D546C',
      marginBottom: '0.5rem'
    },
    contactMessage: {
      fontSize: '0.9rem',
      color: '#555',
      marginBottom: '0.5rem',
      padding: '0.5rem',
      background: '#f8f9fa',
      borderRadius: '6px'
    },
    adminReplyBox: {
      marginTop: '0.75rem',
      padding: '0.75rem',
      background: '#e8f4e8',
      borderRadius: '8px',
      borderLeft: '3px solid #28a745'
    },
    adminBadge: {
      background: '#1D546C',
      color: 'white',
      fontSize: '0.7rem',
      padding: '2px 8px',
      borderRadius: '4px',
      marginLeft: '8px'
    },
    pendingBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      backgroundColor: '#ffc107',
      color: '#333',
      marginLeft: '8px'
    },
    repliedBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      backgroundColor: '#28a745',
      color: 'white',
      marginLeft: '8px'
    },
    unreadIndicator: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      backgroundColor: '#dc3545',
      borderRadius: '50%',
      marginLeft: '8px',
      animation: 'pulse 1s infinite'
    }
  };

  if (loading) {
    return (
      <main style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.heroH1}>My <span style={{ color: 'yellow' }}>Profile</span></h1>
          <p style={styles.heroP}>Loading your profile...</p>
        </section>
        <div style={styles.loadingText}>Loading profile data...</div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <section style={styles.hero} className="fade-in">
        <h1 style={styles.heroH1}>My <span style={{ color: 'yellow' }}>Profile</span></h1>
        <p style={styles.heroP}>Manage your account information and preferences</p>
      </section>

      <div style={styles.profileContainer}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <img 
            src={picSrc} 
            alt='Profile' 
            style={styles.profileImage}
          />
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{name}</h2>
            <p style={styles.profileUsername}>@{username}</p>
            <p style={styles.profileEmail}>{email}</p>
          </div>
        </div>

        {msg && <p style={styles.successMsg}>{msg}</p>}
        {errorMsg && <p style={styles.errorMsg}>{errorMsg}</p>}

        {/* Account Information Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Account Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Full Name</span>
              <span style={styles.infoValue}>{name || 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Username</span>
              <span style={styles.infoValue}>@{username || 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Email Address</span>
              <span style={styles.infoValue}>{email || 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Date of Birth</span>
              <span style={styles.infoValue}>{dob || 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Gender</span>
              <span style={styles.infoValue}>{gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Account Type</span>
              <span style={styles.infoValue}>{accountType ? accountType.charAt(0).toUpperCase() + accountType.slice(1) : 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Experience Level</span>
              <span style={styles.infoValue}>{experience ? experience.charAt(0).toUpperCase() + experience.slice(1) : 'Not set'}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Sports of Interest</span>
              <div style={styles.sportsList}>
                {sports && sports.length > 0 ? sports.map((sport, index) => (
                  <span key={index} style={styles.sportTag}>
                    {sport.charAt(0).toUpperCase() + sport.slice(1)}
                  </span>
                )) : 'None selected'}
              </div>
            </div>
          </div>
        </div>

        {/* My Posts Section */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>My Posts</h3>
          {postsLoading ? (
            <p>Loading your posts...</p>
          ) : userPosts.length === 0 ? (
            <div style={styles.emptyState}>
              <p>You haven't created any posts yet.</p>
              <Link to="/create-post" style={styles.btn}>Create Your First Post</Link>
            </div>
          ) : (
            <div style={styles.postsGrid}>
              {userPosts.map((post) => (
                <div key={post._id} style={styles.postCard}>
                  {post.image && (
                    <img 
                      src={`http://localhost:5000/uploads/${post.image}`}
                      alt={post.title}
                      style={styles.postImage}
                    />
                  )}
                  <div style={styles.postContent}>
                    <h4 style={styles.postTitle}>{post.title}</h4>
                    <p style={styles.postExcerpt}>
                      {post.body.substring(0, 100)}...
                    </p>
                    <p style={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <div style={styles.postActions}>
                      <Link 
                        to={`/posts/${post._id}`}
                        style={{...styles.btn, ...styles.btnSmall}}
                      >
                        View
                      </Link>
                      <Link 
                        to={`/edit-post/${post._id}`}
                        style={{...styles.btn, ...styles.btnSmall}}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeletePost(post._id)}
                        style={{...styles.btn, ...styles.btnSmall, ...styles.btnDanger}}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Replies to Contact Messages - DISPLAYED DIRECTLY ON PROFILE */}
        {user?.role !== 'admin' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>
              📬 Admin Responses to Your Messages
              {contactMessages.some(c => c.adminReply && !c.adminReply.isRead) && (
                <span style={{
                  background: '#dc3545',
                  color: 'white',
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  marginLeft: '10px'
                }}>
                  New Replies!
                </span>
              )}
            </h3>
            
            {loadingReplies ? (
              <p>Loading your messages...</p>
            ) : contactMessages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>📭 You haven't sent any messages yet.</p>
                <Link to="/contact" style={{...styles.btn, display: 'inline-block', marginTop: '1rem'}}>
                  Send a Message to Admin
                </Link>
              </div>
            ) : (
              <div>
                {contactMessages.map((contact) => (
                  <div key={contact._id} style={contactRepliesStyles.contactCard}>
                    <div style={contactRepliesStyles.contactSubject}>
                      {contact.subject}
                      {contact.status === 'replied' ? (
                        <span style={contactRepliesStyles.repliedBadge}>✓ Replied</span>
                      ) : (
                        <span style={contactRepliesStyles.pendingBadge}>Pending</span>
                      )}
                      {contact.adminReply && !contact.adminReply.isRead && (
                        <span style={contactRepliesStyles.unreadIndicator}></span>
                      )}
                    </div>
                    
                    <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.5rem' }}>
                      Sent: {new Date(contact.createdAt).toLocaleString()}
                    </div>
                    
                    <div style={contactRepliesStyles.contactMessage}>
                      <strong>Your Message:</strong>
                      <p style={{ marginTop: '4px', marginBottom: '0' }}>{contact.message}</p>
                    </div>
                    
                    {contact.adminReply && contact.adminReply.body ? (
                      <div style={contactRepliesStyles.adminReplyBox}>
                        <div>
                          <strong>Admin Response:</strong>
                          <span style={contactRepliesStyles.adminBadge}>Admin</span>
                          <small style={{ marginLeft: '8px', color: '#666' }}>
                            {new Date(contact.adminReply.repliedAt).toLocaleString()}
                          </small>
                        </div>
                        <p style={{ marginTop: '8px', marginBottom: '0' }}>{contact.adminReply.body}</p>
                      </div>
                    ) : (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#856404', background: '#fff3cd', padding: '0.5rem', borderRadius: '6px' }}>
                        ⏳ Awaiting admin response...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Profile Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Edit Profile</h3>
          <form onSubmit={handleProfile}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Display Name</label>
              <input 
                type="text"
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder='Display name'
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Bio</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder='Short bio...' 
                rows={3}
                style={styles.textarea}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Change Profile Picture</label>
              <input 
                type='file' 
                accept='image/*' 
                onChange={e => setPic(e.target.files[0])}
                style={styles.input}
              />
            </div>
            <button 
              type='submit' 
              style={styles.btn}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0C2B4E';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1D546C';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Save Profile
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Change Password</h3>
          <form onSubmit={handlePassword}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder='Current password' 
                value={curPw} 
                onChange={e => setCurPw(e.target.value)} 
                required
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>New Password (min 6 chars)</label>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder='New password' 
                value={newPw} 
                onChange={e => setNewPw(e.target.value)} 
                required
                minLength={6}
                style={styles.input}
              />
            </div>
            
            <label style={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={showPassword} 
                onChange={() => setShowPassword(!showPassword)}
              />
              Show passwords
            </label>
            <button 
              type='submit' 
              style={{...styles.btn, marginTop: '1rem'}}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0C2B4E';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#1D546C';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;