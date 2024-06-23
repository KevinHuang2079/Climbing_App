import React, { useState } from 'react';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [caption, setCaption] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [message, setMessage] = useState('');

    const handlePost = async (e) => {
        e.preventDefault();

        if (!caption) {
            setMessage('Caption is required');
            return;
        }

        let videoURL = '';
        let imgURL = '';

        // Upload video
        if (videoFile) {
            try {
                const videoFormData = new FormData();
                videoFormData.append('file', videoFile);

                const response = await fetch('http://localhost:5000/routes/uploads', {
                    method: 'POST',
                    body: videoFormData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const videoData = await response.json();
                videoURL = videoData.fileUrl;
                console.log('Video URL:', videoURL);
            } catch (err) {
                console.error(err);
                setMessage('Error uploading video');
                return;
            }
        }

        // Upload image
        if (imgFile) {
            try {
                const imgFormData = new FormData();
                imgFormData.append('file', imgFile);

                const response = await fetch('http://localhost:5000/routes/uploads', {
                    method: 'POST',
                    body: imgFormData,
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const imgData = await response.json();
                imgURL = imgData.fileUrl;
                console.log('Image URL:', imgURL);
            } catch (err) {
                console.error(err);
                setMessage('Error uploading image');
                return;
            }
        }

        // Create a new post
        try {
            const response = await fetch('http://localhost:5000/ClimbingApp/climbs/createClimb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ caption, videoFile: videoURL, imgFile: imgURL }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("----------------asdf----------",data);
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
        </div>
    );
};

export default Posts;
