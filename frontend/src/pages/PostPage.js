// frontend/src/pages/PostPage.js
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  
  // Edit comment states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentBody, setEditingCommentBody] = useState('');
  
  // Reply states
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [replyBody, setReplyBody] = useState('');

  const loadPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/${id}`);
      const p = res.data;
      setPost(p);
      setLikesCount(p.likedBy?.length || 0);
      setLiked(user ? p.likedBy?.some((uid) => uid.toString() === user._id.toString()) : false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const loadComments = useCallback(async () => {
    try {
      const res = await API.get(`/comments/${id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
    loadComments();
  }, [loadPost, loadComments]);

  useEffect(() => {
    if (post && user) {
      setLiked(post.likedBy?.some((uid) => uid.toString() === user._id.toString()));
    }
  }, [post, user]);

  const handleHeart = async () => {
    if (!user) {
      setError('Please log in to heart posts.');
      return;
    }

    try {
      const res = await API.post(`/posts/${id}/heart`);
      setLikesCount(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not toggle heart');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setCommentError('Please log in to comment.');
      return;
    }
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }

    try {
      const res = await API.post(`/comments/${id}`, { body: newComment.trim() });
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
      setCommentError('');
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Could not post comment');
    }
  };

  // Edit comment functions
  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentBody(comment.body);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentBody('');
  };

  const saveEditComment = async (commentId) => {
    if (!editingCommentBody.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }

    try {
      const res = await API.put(`/comments/${commentId}`, { body: editingCommentBody.trim() });
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      cancelEditComment();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Could not edit comment');
    }
  };

  // Delete comment
  const deleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Could not delete comment');
    }
  };

  // Reply to comment (admin only)
  const startReplyToComment = (commentId) => {
    setReplyingToCommentId(commentId);
    setReplyBody('');
  };

  const cancelReply = () => {
    setReplyingToCommentId(null);
    setReplyBody('');
  };

  const submitReply = async (commentId) => {
    if (!replyBody.trim()) {
      setCommentError('Reply cannot be empty.');
      return;
    }

    try {
      const res = await API.post(`/comments/${commentId}/reply`, { body: replyBody.trim() });
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      cancelReply();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Could not post reply');
    }
  };

  // Delete reply (admin only)
  const deleteReply = async (commentId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      await API.delete(`/comments/${commentId}/reply/${replyId}`);
      // Reload comments to get updated data
      loadComments();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Could not delete reply');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const canEditComment = (comment) => {
    if (!user) return false;
    return user._id === comment.author?._id || user.role === 'admin';
  };

  const canDeleteComment = (comment) => {
    if (!user) return false;
    return user._id === comment.author?._id || user.role === 'admin';
  };

  const canReply = () => {
    return user && user.role === 'admin';
  };

  if (loading) return (
    <main className="container">
      <section className="hero fade-in" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/Ateneo.jpg') center/cover no-repeat"
      }}>
        <h1>Loading<span style={{ color: 'yellow' }}> Post</span></h1>
        <p>Please wait while we load the content...</p>
      </section>
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading post...</p>
      </div>
    </main>
  );
  
  if (error) return (
    <main className="container">
      <section className="hero fade-in" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/Ateneo.jpg') center/cover no-repeat"
      }}>
        <h1>Error<span style={{ color: 'yellow' }}> Occurred</span></h1>
        <p>Something went wrong</p>
      </section>
      <div className="page-container">
        <p className="error-msg">{error}</p>
        <button onClick={goBack} className="btn">Go Back</button>
      </div>
    </main>
  );
  
  if (!post) return (
    <main className="container">
      <section className="hero fade-in" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/Ateneo.jpg') center/cover no-repeat"
      }}>
        <h1>Post Not<span style={{ color: 'yellow' }}> Found</span></h1>
        <p>The post you're looking for doesn't exist</p>
      </section>
      <div className="page-container">
        <p>Post not found.</p>
        <button onClick={goBack} className="btn">Go Back</button>
      </div>
    </main>
  );

  // Add styles for comment actions
  const commentStyles = {
    commentActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '8px'
    },
    editBtn: {
      background: 'none',
      border: 'none',
      color: '#1D546C',
      cursor: 'pointer',
      fontSize: '0.8rem',
      padding: '2px 8px'
    },
    deleteBtn: {
      background: 'none',
      border: 'none',
      color: '#dc3545',
      cursor: 'pointer',
      fontSize: '0.8rem',
      padding: '2px 8px'
    },
    replyBtn: {
      background: 'none',
      border: 'none',
      color: '#28a745',
      cursor: 'pointer',
      fontSize: '0.8rem',
      padding: '2px 8px'
    },
    editInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '0.9rem',
      marginBottom: '8px'
    },
    editActions: {
      display: 'flex',
      gap: '8px'
    },
    saveBtn: {
      background: '#1D546C',
      color: 'white',
      border: 'none',
      padding: '4px 12px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    cancelBtn: {
      background: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '4px 12px',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    replyBox: {
      marginTop: '10px',
      marginLeft: '30px',
      padding: '10px',
      background: '#f8f9fa',
      borderRadius: '8px'
    },
    replyInput: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '0.9rem',
      marginBottom: '8px'
    },
    replyActions: {
      display: 'flex',
      gap: '8px'
    },
    replyItem: {
      marginTop: '10px',
      padding: '8px',
      background: '#e9ecef',
      borderRadius: '6px',
      marginLeft: '20px'
    },
    adminBadge: {
      background: '#1D546C',
      color: 'white',
      fontSize: '0.7rem',
      padding: '2px 6px',
      borderRadius: '4px',
      marginLeft: '8px'
    },
    editedBadge: {
      fontSize: '0.7rem',
      color: '#6c757d',
      marginLeft: '8px'
    }
  };

  return (
    <main className="container">
      <section className="hero fade-in" style={{
        background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/Ateneo.jpg') center/cover no-repeat"
      }}>
        <h1>Read the<span style={{ color: 'yellow' }}> Full Story</span></h1>
        <p>Explore the complete article and join the conversation</p>
      </section>

      <div className="page-container">
        <div className="back-button-container">
          <button onClick={goBack} className="back-button">
            ← Back to Posts
          </button>
        </div>

        <div className="post-page">
          <div className="post-header">
            <div className="post-avatar">
              {post.author?.profilePic ? (
                <img 
                  src={`http://localhost:5000/uploads/${post.author.profilePic}`} 
                  alt={post.author.name} 
                  className="profile-pic-preview"
                />
              ) : (
                post.author?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div className="post-user-info">
              <h4>{post.author?.name || 'Unknown User'}</h4>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              {(user?._id === post.author?._id || user?.role === 'admin') && (
                <Link to={`/edit-post/${post._id}`} className="edit-link">Edit</Link>
              )}
            </div>
          </div>

          <div className="post-content">
            <h2 style={{margin: '0 0 1rem 0', fontSize: '1.5rem'}}>{post.title}</h2>
          </div>

          {post.image && (
            <img
              className="post-image"
              src={`http://localhost:5000/uploads/${post.image}`}
              alt={post.title}
              style={{ maxWidth: '100%', borderRadius: '8px', margin: '1rem 0' }}
            />
          )}
          <div className="post-body">{post.body}</div>

          <div className="post-stats">
            <span>❤️ {likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
            <span>💬 {comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </div>

          <div className="post-interactions">
            {user ? (
              <>
                <button onClick={handleHeart} className={`post-action ${liked ? 'liked' : ''}`}>
                  {liked ? '❤️' : '🤍'} <span>Like</span>
                </button>
                <div className="post-action">
                  💬 <span>Comment</span>
                </div>
              </>
            ) : (
              <div className="post-action">
                <Link to="/login">🔐 Login to interact</Link>
              </div>
            )}
          </div>

          <section className="comments-section" id="comments">
            {user ? (
              <form onSubmit={handleAddComment} className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                />
                <button type="submit" className="btn">Post Comment</button>
                {commentError && <p className="error-msg">{commentError}</p>}
              </form>
            ) : (
              <div style={{padding: '1rem', textAlign: 'center', color: '#666'}}>
                <Link to="/login" style={{color: '#1877f2'}}>Log in</Link> to comment on this post.
              </div>
            )}

            <div className="comments-list">
              {comments.length === 0 && (
                <div style={{padding: '1rem', textAlign: 'center', color: '#666', fontSize: '0.9rem'}}>
                  💭 No comments yet. Be the first to comment!
                </div>
              )}
              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.author?.profilePic ? (
                      <img 
                        src={`http://localhost:5000/uploads/${comment.author.profilePic}`} 
                        alt={comment.author.name} 
                        className="profile-pic-preview"
                      />
                    ) : (
                      comment.author?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div className="comment-content">
                    <div>
                      <strong>{comment.author?.name || 'Unknown'}</strong>
                      <span className="comment-meta">{new Date(comment.createdAt).toLocaleDateString()}</span>
                      {comment.edited && <span style={commentStyles.editedBadge}>(edited)</span>}
                    </div>
                    
                    {editingCommentId === comment._id ? (
                      <div>
                        <textarea
                          value={editingCommentBody}
                          onChange={(e) => setEditingCommentBody(e.target.value)}
                          style={commentStyles.editInput}
                          rows={3}
                        />
                        <div style={commentStyles.editActions}>
                          <button onClick={() => saveEditComment(comment._id)} style={commentStyles.saveBtn}>
                            Save
                          </button>
                          <button onClick={cancelEditComment} style={commentStyles.cancelBtn}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>{comment.body}</p>
                    )}
                    
                    <div style={commentStyles.commentActions}>
                      {canEditComment(comment) && !editingCommentId && (
                        <button onClick={() => startEditComment(comment)} style={commentStyles.editBtn}>
                          ✏️ Edit
                        </button>
                      )}
                      {canDeleteComment(comment) && (
                        <button onClick={() => deleteComment(comment._id)} style={commentStyles.deleteBtn}>
                          🗑️ Delete
                        </button>
                      )}
                      {canReply() && (
                        <button onClick={() => startReplyToComment(comment._id)} style={commentStyles.replyBtn}>
                          💬 Reply as Admin
                        </button>
                      )}
                    </div>
                    
                    {/* Admin Reply Box */}
                    {replyingToCommentId === comment._id && (
                      <div style={commentStyles.replyBox}>
                        <textarea
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="Write your admin reply..."
                          style={commentStyles.replyInput}
                          rows={2}
                        />
                        <div style={commentStyles.replyActions}>
                          <button onClick={() => submitReply(comment._id)} style={commentStyles.saveBtn}>
                            Post Reply
                          </button>
                          <button onClick={cancelReply} style={commentStyles.cancelBtn}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Display Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div style={{ marginTop: '15px', marginLeft: '20px' }}>
                        {comment.replies.map((reply) => (
                          <div key={reply._id} style={commentStyles.replyItem}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <strong>{reply.author?.name || 'Admin'}</strong>
                                {reply.isAdminReply && <span style={commentStyles.adminBadge}>Admin</span>}
                                <small style={{ marginLeft: '8px', color: '#6c757d' }}>
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </small>
                              </div>
                              {user?.role === 'admin' && (
                                <button 
                                  onClick={() => deleteReply(comment._id, reply._id)}
                                  style={{ ...commentStyles.deleteBtn, fontSize: '0.7rem' }}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p style={{ marginTop: '5px', marginBottom: '0' }}>{reply.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PostPage;