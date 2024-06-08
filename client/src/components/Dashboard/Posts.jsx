import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [caption, setCaption] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/ClimbingApp/posts');
                setPosts(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPosts();
    }, []); // Empty dependency array to run the effect only once

    const handlePost = async (e) => {
        e.preventDefault();

        if (!caption) {
            setMessage('Caption is required');
            return;
        }

        const formData = new FormData();
        formData.append('caption', caption);
        if (videoFile) {
            formData.append('videoFile', videoFile);
        }
        if (imgFile) {
            formData.append('imgFile', imgFile);
        }

        try {
            const formData = new FormData();
            formData.append('caption', caption);
            formData.append('videoFile', videoFile);
            formData.append('imgFile', imgFile);
            console.log(formData);
        
            const response = await fetch('/climbs/createClimb', {
                method: 'POST',
                headers: {
                },
                body: formData,
            });
            console.log(response);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            const data = await response.json();
            setPosts([...posts, data]);
            setCaption('');
            setVideoFile(null);
            setImgFile(null);
            setShowForm(false);
            setMessage('Post created successfully');
        } catch (err) {
            console.error(err);
            setMessage('Error creating post');
        }
        
    };

    const handleVideoFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'video/mp4' || file.type === 'video/mpeg')) {
            setVideoFile(file);
        } else {
            setVideoFile(null);
            alert('Please select a valid video file (MP4 or MPEG)');
        }
    };

    const handleImgFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setImgFile(file);
        } else {
            setImgFile(null);
            alert('Please select a valid image file (JPEG or PNG)');
        }
    };

    return (
        <div className='posts-section'>
            <h2>Posts</h2>
            <button className="PostButton" onClick={() => setShowForm(!showForm)}>Post A Climb!</button>
            {showForm && (
                <div className='post-form'>
                    <form onSubmit={handlePost}>
                        <div>
                            <label>Caption</label>
                            <input
                                type='text'
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Upload Video</label>
                            <input
                                type='file'
                                accept='video/mp4,video/mpeg'
                                onChange={handleVideoFileChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Upload Image</label>
                            <input
                                type='file'
                                accept='image/jpeg,image/png'
                                onChange={handleImgFileChange}
                            />
                        </div>
                        <button type='submit'>Submit Post</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            )}
            <div className='posts-list'>
                {posts.map((post, index) => (
                    <div key={index} className='post'>
                        <h3>{post.caption}</h3>
                        <p>Date: {new Date(post.date).toLocaleString()}</p>
                        <p>Likes: {post.likes}</p>
                        <p>Comments: {post.comments}</p>
                        {post.fileUrls.map((url, i) => (
                            <div key={i}>
                                {url.includes('video') ? (
                                    <a href={url} target='_blank' rel='noopener noreferrer'>Video {i + 1}</a>
                                ) : (
                                    <a href={url} target='_blank' rel='noopener noreferrer'>Image {i + 1}</a>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Posts;
