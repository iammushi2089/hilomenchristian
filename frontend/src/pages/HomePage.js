import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../global.css';

function HomePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsCount, setCommentsCount] = useState({});
    const [likingPost, setLikingPost] = useState({});

    useEffect(() => {
        fetchPostsAndComments();
    }, []);

    const fetchPostsAndComments = async () => {
        try {
            // Fetch posts
            const postsRes = await API.get('/posts');
            const postsData = postsRes.data;
            setPosts(postsData);
            
            // Fetch comments count for each post
            const commentsPromises = postsData.map(post => 
                API.get(`/comments/${post._id}`).then(res => ({
                    postId: post._id,
                    count: res.data.length
                })).catch(() => ({ postId: post._id, count: 0 }))
            );
            
            const commentsResults = await Promise.all(commentsPromises);
            const commentsMap = {};
            commentsResults.forEach(result => {
                commentsMap[result.postId] = result.count;
            });
            setCommentsCount(commentsMap);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId, e) => {
        e.stopPropagation(); // Prevent triggering the card click
        if (!user) {
            alert('Please login to like posts');
            return;
        }

        setLikingPost(prev => ({ ...prev, [postId]: true }));
        
        try {
            const response = await API.post(`/posts/${postId}/heart`);
            
            // Update the posts state with new like count
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId 
                        ? { ...post, likedBy: response.data.liked ? [...post.likedBy, user._id] : post.likedBy.filter(id => id !== user._id) }
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setLikingPost(prev => ({ ...prev, [postId]: false }));
        }
    };

    const handleCommentClick = (postId, e) => {
        e.stopPropagation(); // Prevent triggering the card click
        navigate(`/posts/${postId}#comments`);
    };

    const goToPost = (postId) => {
        navigate(`/posts/${postId}`);
    };

    const isPostLiked = (post) => {
        if (!user) return false;
        return post.likedBy?.some(id => id === user._id);
    };

    return (
        <main className="container">
            {/* Hero Section */}
            <section className="hero fade-in" style={{
                background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/ChocoMucho.jpg') center/cover no-repeat"
            }}>
                <h1>Welcome to the <span style={{ color: 'white' }}>World</span> of <span style={{ color: 'yellow' }}>Sports</span></h1>
                <p>Explore athletic excellence, learn about different sports, and discover what makes sports an essential part of human culture and development.</p>
            </section>

            {/* Highlights Section */}
            <h2>Why Sports Matter</h2>
            <ul className="highlights-list">
                <li>Builds physical fitness and mental toughness</li>
                <li>Teaches teamwork, discipline, and leadership</li>
                <li>Creates global unity through international competitions</li>
                <li>Improves mental health and reduces stress</li>
                <li>Offers career opportunities and personal growth</li>
            </ul>

            {/* Latest Posts Section */}
            <br />
            <br />
            <h2>Latest Posts</h2>
            {loading ? (
                <p>Loading posts...</p>
            ) : (
                <>
                    {posts.length === 0 && <p>No posts yet. Be the first to write one!</p>}
                    <div className="posts-grid">
                        {posts.map(post => (
                            <article 
                                key={post._id} 
                                className="post-card card clickable-card"
                                onClick={() => goToPost(post._id)}
                            >
                                {post.image && (
                                    <img 
                                        src={`http://localhost:5000/uploads/${post.image}`}
                                        alt={post.title}
                                        loading="lazy"
                                    />
                                )}
                                <div className="card-content">
                                    <h3>{post.title}</h3>
                                    <p className="post-excerpt">{post.body.substring(0, 120)}...</p>
                                    
                                    {/* Post Stats Row - Date, Likes, Comments */}
                                    <div className="post-stats-row">
                                        <small className="post-date">
                                            📅 {new Date(post.createdAt).toLocaleDateString()}
                                        </small>
                                        <div className="post-stats-right">
                                            <button 
                                                className={`post-like-btn ${isPostLiked(post) ? 'liked' : ''}`}
                                                onClick={(e) => handleLike(post._id, e)}
                                                disabled={likingPost[post._id]}
                                            >
                                                {likingPost[post._id] ? '❤️' : (isPostLiked(post) ? '❤️' : '🤍')}
                                                <span>{post.likedBy?.length || 0}</span>
                                            </button>
                                            <button 
                                                className="post-comment-link"
                                                onClick={(e) => handleCommentClick(post._id, e)}
                                            >
                                                💬 <span>{commentsCount[post._id] || 0}</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Author */}
                                    <div className="post-footer">
                                        <small className="post-author">👤 By {post.author?.name || 'Unknown'}</small>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}

            {/* Featured Sports Preview */}
            <section>
                <br />
                <br />
                <h2>Featured Sports Categories</h2>
                <div className="highlights-grid">
                    <article className="card fade-in">
                        <img src="/assets/Ateneo.jpg" alt="Basketball game in action" loading="lazy" />
                        <div className="card-content">
                            <h3>Team Sports</h3>
                            <p>Learn about basketball, soccer, volleyball, and other team sports that emphasize collaboration and strategy.</p>
                            <Link to="/about" className="btn btn-secondary">About Sports</Link>
                        </div>
                    </article>

                    <article className="card fade-in">
                        <img src="/assets/MartialArts.jpg" alt="Tennis player serving" loading="lazy" />
                        <div className="card-content">
                            <h3>Individual Sports</h3>
                            <p>Explore tennis, gymnastics, swimming, and martial arts where personal excellence and self-discipline shine.</p>
                            <Link to="/contact" className="btn btn-secondary">Contact and Resources</Link>
                        </div>
                    </article>

                    <article className="card fade-in">
                        <img src="/assets/Triathlon.jpg" alt="Extreme sports athlete in action" loading="lazy" />
                        <div className="card-content">
                            <h3>Extreme & Adventure Sports</h3>
                            <p>Discover rock climbing, surfing, snowboarding, and other adrenaline-filled activities that push boundaries.</p>
                            <Link to="/register" className="btn btn-secondary">Sign Up</Link>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}

export default HomePage;