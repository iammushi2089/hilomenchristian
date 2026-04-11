// frontend/src/pages/AdminPage.js - Add reply modal and functionality

import { useState, useEffect, useCallback } from 'react'; 
import API from '../api/axios';

const AdminPage = () => { 
  const [users, setUsers] = useState([]); 
  const [posts, setPosts] = useState([]); 
  const [contacts, setContacts] = useState([]); 
  const [tab, setTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', bio: '', profilePic: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Reply modal states
  const [replyingToContact, setReplyingToContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, postsRes, contactsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/posts'),
        API.get('/admin/contacts')
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
      setContacts(contactsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      showMessage('Failed to load data', 'error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleStatus = async (id) => { 
    try {
      const response = await API.put(`/admin/users/${id}/status`);
      const updatedUser = response.data.user || response.data;
      setUsers(users.map(u => u._id === id ? updatedUser : u));
      showMessage(`User status updated to ${updatedUser.status}`, 'success');
    } catch (err) {
      console.error('Error toggling status:', err);
      showMessage(err.response?.data?.message || 'Failed to update user status', 'error');
    }
  };

  const editUser = async (id) => {
    try {
      const response = await API.get(`/admin/users/${id}`);
      const userData = response.data;
      setEditingUser(userData);
      setEditForm({ 
        name: userData.name || '', 
        bio: userData.bio || '', 
        profilePic: userData.profilePic || '', 
        newPassword: '' 
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      showMessage('Failed to load user data', 'error');
    }
  };

  const saveUser = async () => {
    setLoading(true);
    try {
      const response = await API.put(`/admin/users/${editingUser._id}`, {
        name: editForm.name,
        bio: editForm.bio,
        profilePic: editForm.profilePic
      });
      
      const updatedUser = response.data.user || response.data;
      setUsers(users.map(u => u._id === editingUser._id ? updatedUser : u));
      
      if (editForm.newPassword && editForm.newPassword.length >= 6) {
        await API.put(`/admin/users/${editingUser._id}/password`, { 
          newPassword: editForm.newPassword 
        });
        showMessage('User updated and password changed successfully', 'success');
      } else if (editForm.newPassword && editForm.newPassword.length < 6) {
        showMessage('Password not changed (minimum 6 characters required)', 'error');
        return;
      } else {
        showMessage('User updated successfully', 'success');
      }
      
      setEditingUser(null);
      setEditForm({ name: '', bio: '', profilePic: '', newPassword: '' });
    } catch (err) {
      console.error('Error saving user:', err);
      showMessage(err.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const removePost = async (id) => { 
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
      showMessage('Post removed successfully', 'success');
    } catch (err) {
      console.error('Error removing post:', err);
      showMessage('Failed to remove post', 'error');
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    try {
      await API.delete(`/admin/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      showMessage('Post deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting post:', err);
      showMessage('Failed to delete post', 'error');
    }
  };

  // NEW: Handle replying to contact message
  const handleReplyToContact = (contact) => {
    setReplyingToContact(contact);
    setReplyMessage('');
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      showMessage('Please enter a reply message', 'error');
      return;
    }
    
    setSendingReply(true);
    try {
      const response = await API.post(`/admin/contacts/${replyingToContact._id}/reply`, {
        reply: replyMessage.trim()
      });
      
      // Update the contact in the list
      setContacts(contacts.map(c => 
        c._id === replyingToContact._id ? response.data.contact : c
      ));
      
      showMessage(`Reply sent to ${replyingToContact.sender.name}`, 'success');
      setReplyingToContact(null);
      setReplyMessage('');
    } catch (err) {
      console.error('Error sending reply:', err);
      showMessage(err.response?.data?.message || 'Failed to send reply', 'error');
    } finally {
      setSendingReply(false);
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
    message: {
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    successMsg: {
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    errorMsg: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    replyBtn: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '4px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.85rem'
    },
    repliedBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      backgroundColor: '#28a745',
      color: 'white'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalHeader: {
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #1D546C'
    },
    originalMessage: {
      background: '#f8f9fa',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1rem',
      fontFamily: 'inherit',
      marginBottom: '1rem'
    },
    modalActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end'
    },
    sendBtn: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 20px',
      borderRadius: '6px',
      cursor: 'pointer'
    },
    cancelBtn: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '8px 20px',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  };

  return (
    <main style={styles.container}>
      <section style={styles.hero} className="fade-in">
        <h1 style={styles.heroH1}>Admin <span style={{ color: 'yellow' }}>Dashboard</span></h1>
        <p style={styles.heroP}>Manage users, posts, and contact messages from one central hub</p>
      </section>

      <div className="page-container">
        <div className='admin-page'>
          {message.text && (
            <div style={{...styles.message, ...(message.type === 'success' ? styles.successMsg : styles.errorMsg)}}>
              {message.text}
            </div>
          )}

          <h2>Admin Dashboard</h2>
          <div className='admin-tabs'>
            <button onClick={() => setTab('users')} className={tab === 'users' ? 'active' : ''}>
              Members ({users.length})
            </button>
            <button onClick={() => setTab('posts')} className={tab === 'posts' ? 'active' : ''}>
              All Posts ({posts.length})
            </button>
            <button onClick={() => setTab('contacts')} className={tab === 'contacts' ? 'active' : ''}>
              Messages ({contacts.length})
            </button>
          </div>
          
          {tab === 'users' && (
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                    <td>
                      <button 
                        onClick={() => toggleStatus(u._id)} 
                        style={{ borderRadius: '8px', margin: '5px 0', padding: '2px 4px' }}
                        className={u.status === 'active' ? 'btn-danger' : 'btn-success'}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'} 
                      </button>
                      <button 
                        onClick={() => editUser(u._id)} 
                        className='btn-primary' 
                        style={{ borderRadius: '8px', margin: '5px 0', padding: '2px 4px' }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {tab === 'posts' && (
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(p => (
                  <tr key={p._id}>
                    <td>{p.title}</td>
                    <td>{p.author?.name}</td>
                    <td><span className={`status-badge ${p.status}`}>{p.status}</span></td>
                    <td>
                      {p.status === 'published' && (
                        <button className='btn-danger' style={{ borderRadius: '8px', margin: '5px 0', padding: '2px 4px' }} onClick={() => removePost(p._id)}>
                          Remove
                        </button>
                      )}
                      <button className='btn-danger' style={{ borderRadius: '8px', margin: '5px 0', padding: '2px 4px' }} onClick={() => deletePost(p._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {tab === 'contacts' && (
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c._id}>
                    <td>{c.sender?.name}</td>
                    <td>{c.sender?.email}</td>
                    <td>{c.subject}</td>
                    <td>{c.message.length > 80 ? c.message.substring(0, 80) + '...' : c.message}</td>
                    <td>
                      {c.status === 'replied' ? (
                        <span style={styles.repliedBadge}>✓ Replied</span>
                      ) : (
                        <span style={{...styles.repliedBadge, backgroundColor: '#ffc107', color: '#333'}}>Pending</span>
                      )}
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleReplyToContact(c)} 
                        style={styles.replyBtn}
                      >
                        {c.status === 'replied' ? 'Edit Reply' : 'Reply'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {editingUser && (
            <div className='modal'>
              <div className='modal-content'>
                <h3>Edit User: {editingUser.name}</h3>
                <label>Name:</label>
                <input 
                  type='text' 
                  value={editForm.name} 
                  onChange={e => setEditForm({...editForm, name: e.target.value})} 
                />
                <label>Bio:</label>
                <textarea 
                  value={editForm.bio} 
                  onChange={e => setEditForm({...editForm, bio: e.target.value})} 
                  rows="3"
                />
                <label>Profile Pic (filename):</label>
                <input 
                  type='text' 
                  value={editForm.profilePic} 
                  onChange={e => setEditForm({...editForm, profilePic: e.target.value})} 
                  placeholder="e.g., filename.jpg"
                />
                <label>New Password (min 6 characters, leave blank to keep current):</label>
                <input 
                  type='password' 
                  value={editForm.newPassword} 
                  onChange={e => setEditForm({...editForm, newPassword: e.target.value})} 
                />
                <div className='modal-actions'>
                  <button onClick={saveUser} className='btn-success' disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => setEditingUser(null)} className='btn-danger'>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Reply Modal */}
          {replyingToContact && (
            <div style={styles.modalOverlay} onClick={() => setReplyingToContact(null)}>
              <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalHeader}>
                  <h3>Reply to {replyingToContact.sender?.name}</h3>
                </div>
                
                <div style={styles.originalMessage}>
                  <p><strong>Subject:</strong> {replyingToContact.subject}</p>
                  <p><strong>Original Message:</strong></p>
                  <p style={{marginTop: '8px', padding: '8px', background: '#fff', borderRadius: '4px'}}>
                    {replyingToContact.message}
                  </p>
                  {replyingToContact.adminReply?.body && (
                    <div style={{marginTop: '10px', padding: '8px', background: '#d4edda', borderRadius: '4px'}}>
                      <strong>Previous Reply:</strong>
                      <p style={{marginTop: '5px'}}>{replyingToContact.adminReply.body}</p>
                      <small>Replied on: {new Date(replyingToContact.adminReply.repliedAt).toLocaleString()}</small>
                    </div>
                  )}
                </div>
                
                <textarea
                  style={styles.textarea}
                  rows={5}
                  placeholder="Type your reply here..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                
                <div style={styles.modalActions}>
                  <button onClick={() => setReplyingToContact(null)} style={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button onClick={sendReply} style={styles.sendBtn} disabled={sendingReply}>
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminPage;