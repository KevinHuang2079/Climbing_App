import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../GlobalContext';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const { friends, userID } = useContext(GlobalContext);

    //post submission
    const [showForm, setShowForm] = useState(false);
    const [caption, setCaption] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [imgFile, setImgFile] = useState(null);
    const [message, setMessage] = useState('');

    //comments
    const [openComments, setOpenComments] = useState({});//key=postID, value=bool {tracks which post has open comments}
    const [displayedComments, setDisplayedComments] = useState({});//key=postID, value=array {displayed comments for a post}
    const [commentText, setCommentText] = useState('');
    const [commentImage, setCommentImage] = useState(null);



    useEffect(() => {
        getPosts();
    }, []);

    const likeComment = async(commentID) => {
        try {
            const response = await fetch('/climbs/likeAnUpload', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentID, userID, choice: 'post'}),
            });
        }
        catch(err) {
            console.error("CLIENT:", err);
        }
    }

    const getComments = async(postID) => {
        try{
            const date = new Date().toISOString();
            const response = await fetch(`/climbs/getComments?postID=${encodeURIComponent(postID)}&date=${encodeURIComponent(date)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const comments = await response.json();
            console.log("GET COMMENTS:", comments);
            setDisplayedComments(prev => ({
                ...prev, [postID]: [ ...([] || prev[postID]), ...comments]
            }));
        }
        catch(err) {
            console.error("CLIENT:", err);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setCommentImage(file);
        } else {
            setCommentImage(null);
            alert('Please select a valid image file (JPEG or PNG)');
        }
    }

    const handleCommentSubmit = async(postID) => {
        try{    
            let imgURL = '';
            if (commentImage){
                try {
                    const imgFormData = new FormData();
                    imgFormData.append('file', commentImage);
    
                    const response = await fetch('http://localhost:5000/routes/comments/upload', {
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
                    return;
                }
            }
            console.log("IMGFILE", imgURL);
            const response = await fetch('/climbs/commentPost', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    commentText: commentText, 
                    userID: userID, 
                    postID: postID, 
                    imgURL: imgURL, 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            const comment = await response.json();
            setDisplayedComments(prev => ({
                ...prev, [postID]: [ ...([] || prev[postID]), comment]
            }));
            setCommentImage(null);
            setCommentText('');
        }
        catch (err) {
            console.error("Posts: Error submitting comment", err);
        }
    }

    const likePost = async (postID) => {
        setPosts(prevPosts => 
            prevPosts.map(post => 
                post._id === postID 
                ? { ...post, likes: post.likes.includes(userID) 
                    ? post.likes.filter(id => id !== userID) 
                    : [...post.likes, userID] }
                : post
            )
        );
    
        try {
            const response = await fetch('/climbs/likeAnUpload', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postID, userID, choice: 'post'}),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed to like post: ${errorText}`);
                //Revert the optimistic update
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post._id === postID 
                        ? { ...post, likes: post.likes.includes(userID) 
                            ? [...post.likes, userID] 
                            : post.likes.filter(id => id !== userID) }
                        : post
                    )
                );
            }
        } catch (err) {
            console.error('Posts:', err);
            //Revert the optimistic update in case of an error
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postID 
                    ? { ...post, likes: post.likes.includes(userID) ? [...post.likes, userID] : post.likes.filter(id => id !== userID) }
                    : post
                )
            );
        }
    };
    

    const toggleComments = async(postID) => {
        setOpenComments(prev => ({
            ...prev,
            [postID]: !prev[postID] 
        }));
    }

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

                const response = await fetch('http://localhost:5000/routes/posts/upload', {
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

                const response = await fetch('http://localhost:5000/routes/posts/upload', {
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
            const date = new Date().toISOString();
            const response = await fetch('/climbs/createClimb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ caption: caption, videoFile: videoURL, imgFile: imgURL, dateCreated: date}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPosts(prevPosts => [...prevPosts, data]);
            setCaption('');
            setVideoFile(null);
            setImgFile(null);
            setShowForm(false);
            setMessage(null);
        } catch (err) {
            console.error(err);
            setMessage('Error creating post');
        }
    };

    const getPosts = async() => {
        try {
            const response = await fetch('/climbs/getPosts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({friends}),
            });
            const data = await response.json();
            console.log(data)

            
            setPosts(data);
        }
        catch(error){   
            console.error('Error getting posts: ', error);
        }
    }

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
        <div className='Posts'>

            <div className='postNew-section'>
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
            <div className='showPosts-sections'>
                {posts.map(post => (
                    <div key={post._id} className='post'>
                        <p>{post.caption}</p>
                        {post.videoFile && <video src={post.videoFile} controls />}
                        {post.imgFile && <img src={post.imgFile} alt="Post" />}
                        <p>{new Date(post.dateCreated).toLocaleString()}</p>
                        <p>Likes: {post.likes.length}</p>
                        <button className="LikePostButton" onClick={() => likePost(post._id)}>Like Post</button>
                        <button className="CommentsButton" onClick={() => { toggleComments(post._id); getComments(post._id); }}> Comment</button>


                        {openComments[post._id] && (
                            <div className="CommentSection"> 
                                <div className="comment-form">
                                    <textarea
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={(e)=> setCommentText(e.target.value)
                                        }
                                    />
                                    <input
                                        type="file"
                                        accept='image/jpeg,image/png'
                                        onChange={handleImageChange}
                                    />
                                    <button onClick={() => handleCommentSubmit(post._id)}>Submit</button>
                                </div>
                            </div>
                        )}
                        {openComments[post._id] && displayedComments[post._id] && displayedComments[post._id].length > 0 &&(
                            <div className='comment-list'>
                                {displayedComments[post._id].map(comment =>
                                    <div key={comment._id} className='comment'>
                                        <p><strong>{comment.userID}</strong>: {comment.commentText}</p>
                                        <p>{new Date(comment.dateCreated).toLocaleString()}</p>
                                        {comment.imgFile && <img src={comment.imgFile} alt="" />}
                                        <p>Likes: {comment.numLikes}</p>
                                        <button onClick={() => likeComment(comment._id)}>Like</button>
                                    </div>
                                )}
                            </div>
                        )} 
                    </div>
                ))}
            </div>
        </div>

    );
};

export default Posts;
