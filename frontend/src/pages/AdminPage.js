// frontend/src/pages/AdminPage.js
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
  const [replyingToContact, setReplyingToContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [u, p, c] = await Promise.all([
        API.get('/admin/users', getAuthHeaders()),
        API.get('/admin/posts', getAuthHeaders()),
        API.get('/admin/contacts', getAuthHeaders())
      ]);
      setUsers(u.data); 
      setPosts(p.data); 
      setContacts(c.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Unknown Server Error';
      showMessage(`Admin Error: ${errorMsg}`, 'error');
      console.error("Admin Fetch Error Details:", err.response);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleStatus = async (id) => { 
    try {
      const { data } = await API.put(`/admin/users/${id}/status`, {}, getAuthHeaders());
      setUsers(users.map(u => u._id === id ? data : u));
      showMessage(`User ${data.status === 'active' ? 'Activated' : 'Deactivated'}`, 'success');
    } catch (err) { showMessage('Update failed', 'error'); }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setEditForm({ 
      name: user.name, 
      bio: user.bio || '', 
      profilePic: user.profilePic || '', 
      newPassword: '' 
    });
  };

  const saveUser = async () => {
    setLoading(true);
    try {
      const { data } = await API.put(`/admin/users/${editingUser._id}`, editForm, getAuthHeaders());
      setUsers(users.map(u => u._id === editingUser._id ? data : u));
      if (editForm.newPassword) {
        await API.put(`/admin/users/${editingUser._id}/password`, { newPassword: editForm.newPassword }, getAuthHeaders());
      }
      showMessage('User settings updated', 'success');
      setEditingUser(null);
    } catch (err) { showMessage('Save failed', 'error'); }
    finally { setLoading(false); }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    try {
      await API.delete(`/admin/posts/${id}`, getAuthHeaders());
      setPosts(posts.filter(p => p._id !== id));
      showMessage('Post deleted', 'success');
    } catch (err) { showMessage('Delete failed', 'error'); }
  };

  const handleReplyToContact = (contact) => {
    setReplyingToContact(contact);
    setReplyMessage(contact.adminReply?.body || '');
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    try {
      const { data } = await API.post(`/admin/contacts/${replyingToContact._id}/reply`, { reply: replyMessage }, getAuthHeaders());
      setContacts(contacts.map(c => c._id === replyingToContact._id ? data.contact : c));
      setReplyingToContact(null);
      showMessage('Reply sent to user', 'success');
    } catch (err) { showMessage('Reply failed to send', 'error'); }
    finally { setSendingReply(false); }
  };

  const styles = {
    container: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', color: '#f1f5f9' },
    header: { marginBottom: '30px', borderLeft: '5px solid #38bdf8', paddingLeft: '20px' },
    nav: { display: 'flex', gap: '15px', marginBottom: '30px', background: '#1e293b', padding: '10px', borderRadius: '12px' },
    tabBtn: { padding: '12px 24px', cursor: 'pointer', border: 'none', borderRadius: '8px', fontWeight: '600', transition: '0.3s', flex: 1 },
    activeTab: { backgroundColor: '#1D546C', color: 'white', boxShadow: '0 4px 12px rgba(29, 84, 108, 0.4)' },
    inactiveTab: { backgroundColor: 'transparent', color: '#94a3b8' },
    card: { background: '#0f172a', padding: '25px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
    th: { textAlign: 'left', padding: '15px', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' },
    tr: { background: '#1e293b', transition: '0.2s' },
    td: { padding: '15px', borderTop: '1px solid #334155', borderBottom: '1px solid #334155' },
    badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' },
    actionBtn: { padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', marginLeft: '8px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' },
    modalContent: { background: '#1e293b', padding: '30px', borderRadius: '20px', width: '450px', border: '1px solid #475569', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' },
    input: { width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '15px' }
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <h1 style={{fontSize: '2.5rem', margin: 0}}>Admin <span style={{color: '#38bdf8'}}>Dashboard</span></h1>
        <p style={{color: '#64748b', margin: '5px 0'}}>Manage users, editorial content, and support tickets for hilomenchristian.</p>
      </div>

      {message.text && (
        <div style={{
          padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold',
          backgroundColor: message.type === 'success' ? '#064e3b' : '#450a0a',
          color: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${message.type === 'success' ? '#065f46' : '#7f1d1d'}`
        }}>
          {message.text}
        </div>
      )}
      
      <div style={styles.nav}>
        {['users', 'posts', 'contacts'].map(t => (
          <button 
            key={t}
            onClick={() => setTab(t)} 
            style={{...styles.tabBtn, ...(tab === t ? styles.activeTab : styles.inactiveTab)}}
          >
            {t.toUpperCase()} ({t === 'users' ? users.length : t === 'posts' ? posts.length : contacts.length})
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>{tab === 'users' ? 'Member' : tab === 'posts' ? 'Headline' : 'From'}</th>
              <th style={styles.th}>{tab === 'users' ? 'Status' : tab === 'posts' ? 'Author' : 'Subject'}</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tab === 'users' && users.map(u => (
              <tr key={u._id} style={styles.tr}>
                <td style={{...styles.td, borderRadius: '10px 0 0 10px'}}>
                  <div style={{fontWeight: 'bold'}}>{u.name}</div>
                  <div style={{fontSize: '0.8rem', color: '#64748b'}}>{u.email}</div>
                </td>
                <td style={styles.td}>
                  <span style={{...styles.badge, background: u.status === 'active' ? '#065f46' : '#450a0a', color: u.status === 'active' ? '#34d399' : '#f87171'}}>
                    {u.status?.toUpperCase()}
                  </span>
                </td>
                <td style={{...styles.td, borderRadius: '0 10px 10px 0'}}>
                  <button onClick={() => toggleStatus(u._id)} style={{...styles.actionBtn, background: '#334155', color: '#fff'}}>{u.status === 'active' ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => editUser(u)} style={{...styles.actionBtn, background: '#1D546C', color: '#fff'}}>Edit</button>
                </td>
              </tr>
            ))}

            {tab === 'posts' && posts.map(p => (
              <tr key={p._id} style={styles.tr}>
                <td style={{...styles.td, borderRadius: '10px 0 0 10px'}}>{p.title}</td>
                <td style={styles.td}><span style={{color: '#38bdf8'}}>{p.author?.name}</span></td>
                <td style={{...styles.td, borderRadius: '0 10px 10px 0'}}>
                  <button onClick={() => deletePost(p._id)} style={{...styles.actionBtn, background: '#450a0a', color: '#f87171'}}>Delete</button>
                </td>
              </tr>
            ))}

            {tab === 'contacts' && contacts.map(c => (
              <tr key={c._id} style={styles.tr}>
                {/* ✅ FIX: Now utilizing the backend's explicitly processed senderName */}
                <td style={{...styles.td, borderRadius: '10px 0 0 10px'}}>
                  <div style={{fontWeight: 'bold', color: c.isGuest ? '#cbd5e1' : '#38bdf8'}}>{c.senderName}</div>
                  {c.isGuest && <div style={{fontSize: '0.7rem', color: '#64748b'}}>Guest User</div>}
                </td>
                <td style={styles.td}>
                   <div>{c.subject}</div>
                   <span style={{...styles.badge, background: c.status === 'replied' ? '#1e3a8a' : '#78350f', color: '#fff'}}>
                    {c.status === 'replied' ? 'Resolved' : 'Pending'}
                   </span>
                </td>
                <td style={{...styles.td, borderRadius: '0 10px 10px 0'}}>
                  <button onClick={() => handleReplyToContact(c)} style={{...styles.actionBtn, background: '#1D546C', color: '#fff'}}>
                    {c.status === 'replied' ? 'View/Edit Reply' : 'Send Reply'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{marginTop: 0, color: '#38bdf8'}}>Edit Member Profile</h3>
            <label style={{display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '5px'}}>FULL NAME</label>
            <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={styles.input} />
            <label style={{display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '5px'}}>NEW PASSWORD (OPTIONAL)</label>
            <input type="password" placeholder="Leave blank to keep current" onChange={e => setEditForm({...editForm, newPassword: e.target.value})} style={styles.input} />
            <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
              <button onClick={saveUser} disabled={loading} style={{...styles.actionBtn, background: '#1D546C', color: '#fff', flex: 1, padding: '12px'}}>{loading ? 'Saving...' : 'Save Changes'}</button>
              <button onClick={() => setEditingUser(null)} style={{...styles.actionBtn, background: '#334155', color: '#fff', flex: 1, padding: '12px'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {replyingToContact && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{marginTop: 0, color: '#38bdf8'}}>Support Response</h3>
            <div style={{background: '#0f172a', padding: '15px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', color: '#94a3b8', border: '1px solid #334155'}}>
               <strong style={{color: '#fff'}}>Message from {replyingToContact.senderName}:</strong> <br/>
               "{replyingToContact.message}"
            </div>
            <textarea 
              value={replyMessage} 
              onChange={e => setReplyMessage(e.target.value)} 
              placeholder="Write your response here..."
              style={{...styles.input, height: '120px', resize: 'none'}} 
            />
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={sendReply} disabled={sendingReply} style={{...styles.actionBtn, background: '#1D546C', color: '#fff', flex: 1, padding: '12px'}}>{sendingReply ? 'Sending...' : 'Send Reply'}</button>
              <button onClick={() => setReplyingToContact(null)} style={{...styles.actionBtn, background: '#334155', color: '#fff', flex: 1, padding: '12px'}}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPage;