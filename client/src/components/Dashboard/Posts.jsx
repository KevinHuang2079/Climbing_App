import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../GlobalContext';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const { username, friends, userID } = useContext(GlobalContext);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    //post submission
    const [showForm, setShowForm] = useState(false);
    const [caption, setCaption] = useState('');
    const [videoFiles, setVideoFiles] = useState([]);
    const [imgFiles, setImgFiles] = useState([]);
    const [message, setMessage] = useState('');

    //comments
    const [openComments, setOpenComments] = useState({});//key=postID, value=bool {tracks which post has open comments}
    const [displayedComments, setDisplayedComments] = useState({});//key=postID, value=array {displayed comments for a post}
    const [commentText, setCommentText] = useState('');
    const [commentImage, setCommentImage] = useState(null);


    useEffect(() => {
        getPosts();
    }, []);

    const handleNext = () => {
        setCurrentMediaIndex(prevIndex => (prevIndex + 1) % (imgFiles.length + videoFiles.length));
    };
    
    const handlePrev = () => {
        setCurrentMediaIndex(prevIndex => (prevIndex - 1 + (imgFiles.length + videoFiles.length)) % (imgFiles.length + videoFiles.length));
    };

    const getCurrentMedia = () => {
        if (currentMediaIndex < videoFiles.length) {
            return <video src={videoFiles[currentMediaIndex]} controls />;
        } else {
            return <img src={imgFiles[currentMediaIndex - videoFiles.length]} alt="Post media" />;
        }
    };
    

    const likeComment = async(commentID, postID) => {
        setDisplayedComments(prevComments => ({
            ...prevComments,
            [postID]: prevComments[postID].map(comment => 
                comment._id === commentID 
                ? { ...comment, likes: comment.likes.includes(userID) 
                    ? comment.likes.filter(id => id !== userID) 
                    : [...comment.likes, userID] }
                : comment
            )
        }));
        
        try {
            const response = await fetch('/climbs/likeAnUpload', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ objectToLikeID: commentID, userID, choice: 'comment'}),
            });
            if (!response){
                setDisplayedComments(prevComments => ({
                    ...prevComments,
                    [postID]: prevComments[postID].map(comment => 
                        comment._id === commentID 
                        ? { ...comment, numLikes: comment.likes.includes(userID) 
                            ? [...comment.likes, userID] 
                            : comment.likes.filter(id => id !== userID) }
                        : comment
                    )
                }));
            }
        }
        catch(err) {
            console.error("CLIENT:", err);
            setDisplayedComments(prevComments => ({
                ...prevComments,
                [postID]: prevComments[postID].map(comment => 
                    comment._id === commentID 
                    ? { ...comment, numLikes: comment.likes.includes(userID) 
                        ? [...comment.likes, userID] 
                        : comment.likes.filter(id => id !== userID) }
                    : comment
                )
            }));
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
        setCommentImage(file);
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
                    userName: username,
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
                body: JSON.stringify({ objectToLikeID: postID, userID, choice: 'post'}),
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
        e.preventDefault(); // Prevent default form submission
    
        try {
            // Create FormData to submit caption and files
            const formData = new FormData();
            formData.append('caption', caption);
            
            videoFiles.forEach(file => formData.append('videos', file));
            imgFiles.forEach(file => formData.append('images', file));
    
            const response = await fetch('/your-api-endpoint', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Handle successful response
            const result = await response.json();
            console.log('Post submitted:', result);
            setCaption('');
            setVideoFiles([]);
            setImgFiles([]);
            setMessage('Post submitted successfully');
        } catch (err) {
            console.error('Error submitting post:', err);
            setMessage('Error submitting post');
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
        const files = Array.from(e.target.files);
        
        if (files.length + videoFiles.length > 2) {
            setMessage('You can only upload a maximum of 2 videos');
            return;
        }
        setVideoFiles(prev => [...prev, ...files]);
    
    };
    

    const handleImgFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imgFiles.length > 5) {
            setMessage('You can only upload a maximum of 5 photos');
            return;
        }
        setImgFiles(prev => [...prev, ...files]);
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
                                    accept="video/*"
                                    multiple
                                    onChange={handleVideoFileChange}
                                />
                            </div>
                            <div>
                                <label>Upload Image</label>
                                <input
                                    type='file'
                                    accept="image/*"
                                    multiple
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
                        <p><strong>{post.userName}</strong>: {post.caption}</p>
                        <div className="media-slider">
                            <button onClick={handlePrev}>{"<"}</button>
                            {getCurrentMedia()}
                            <button onClick={handleNext}>{">"}</button>
                        </div>
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
                                        accept="image/*"
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
                                        <p><strong>{comment.userName}</strong>: {comment.commentText}</p>
                                        <p>{new Date(comment.dateCreated).toLocaleString()}</p>
                                        {comment.imgFile && <img src={comment.imgFile} alt="" />}
                                        <p>Likes: { comment.likes.length}</p>
                                        <button onClick={() => likeComment(comment._id, post._id)}>Like</button>
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
