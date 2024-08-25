import React, { useMemo, useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../GlobalContext';
import '../../cssStuff/Posts.scss';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const { username, friends, userID } = useContext(GlobalContext);
    const [currentMediaIndices, setCurrentMediaIndices]  = useState({});//key=postID, value=int (index for iterating through the post's media files)
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
     
    useEffect(() => {
        if (posts.length > 0) {
            console.log('Initializing media indices for posts.');
            setCurrentMediaIndices(() => {
                const newIndices = {};
                posts.forEach(post => {
                    newIndices[post._id] = 0;  // Initialize the index for each post
                });
                return newIndices;
            });
        }
    }, [posts]);


    const createPostMap = (posts) => {
        return posts.reduce((acc, post) => {
            acc[post._id] = post;
            return acc;
        }, {});
    };

    const postMap = useMemo(() => createPostMap(posts), [posts]);
    const handleNext = (postID) => {
        const imgFiles = postMap[postID].imgFiles;
        const videoFiles = postMap[postID].videoFiles;
        
        setCurrentMediaIndices(prevIndexes => ({
            ...prevIndexes,
            [postID]: (prevIndexes[postID] + 1) % (imgFiles.length + videoFiles.length)
        }));
    };
    
    const handlePrev = (postID) => {
        const imgFiles = postMap[postID].imgFiles;
        const videoFiles = postMap[postID].videoFiles;
        
        setCurrentMediaIndices(prevIndexes => ({
            ...prevIndexes,
            [postID]: (prevIndexes[postID] - 1 + (imgFiles.length + videoFiles.length)) % (imgFiles.length + videoFiles.length)
        }));
    };


    const getCurrentMedia = (postID) => {
        const currentMediaIndex = currentMediaIndices[postID];
        const post = posts.find(p => p._id === postID);
    
        if (!post || currentMediaIndex === undefined) {
            return <div>Loading media...</div>;  // Or any placeholder while the indices are being set
        }
    
        if (currentMediaIndex < post.videoFiles.length) {
            return <video src={post.videoFiles[currentMediaIndex]} controls />;
        } else {
            const imgIndex = currentMediaIndex - post.videoFiles.length;
            return <img src={post.imgFiles[imgIndex]} alt="Post media" />;
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
            setDisplayedComments(prev => ({
                ...prev, [postID]: [ ...([] || prev[postID]), ...comments]
            }));
        }
        catch(err) {
            console.error("CLIENT:", err);
        }
    }

    const getReplies = async(commentID) => {
        try{
            const date = new Date().toISOString();
            const response = await fetch(`/climbs/getReplies?postID=${encodeURIComponent(commentID)}&date=${encodeURIComponent(date)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const replies = await response.json();
            setDisplayedComments(prev => ({
                ...prev, [commentID]: [ ...([] || prev[commentID]), ...replies]
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
            const date = new Date().toISOString();
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
                    dateCreated: date,
                    imgURL: imgURL, 
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }
            const comment = await response.json();
            setDisplayedComments(prev => ({
                ...prev, [postID]: [ ...(prev[postID] || []), comment]
            }));
            setCommentImage(null);
            setCommentText('');
        }
        catch (err) {
            console.error("Posts: Error submitting comment", err);
        }
    }

    const handleReplySubmit = async() => {

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
        e.preventDefault();
    
        if (!caption) {
            setMessage('Caption is required');
            return;
        }
    
        try {
            const videoURLs = await Promise.all(videoFiles.map(async (videoFile) => {
                const videoFormData = new FormData();
                videoFormData.append('file', videoFile);
    
                const response = await fetch('http://localhost:5000/routes/posts/upload', {
                    method: 'POST',
                    body: videoFormData,
                });
    
                if (!response.ok) {
                    throw new Error('Failed to upload video');
                }
    
                const videoData = await response.json();
                return videoData.fileUrl;
            }));
    
            const imgURLs = await Promise.all(imgFiles.map(async (imgFile) => {
                const imgFormData = new FormData();
                imgFormData.append('file', imgFile);
    
                const response = await fetch('http://localhost:5000/routes/posts/upload', {
                    method: 'POST',
                    body: imgFormData,
                });
    
                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }
    
                const imgData = await response.json();
                return imgData.fileUrl;
            }));
    
            // Create a new post
            const date = new Date().toISOString();
            const response = await fetch('/climbs/createClimb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userName: username, 
                    caption, 
                    videoFiles: videoURLs, 
                    imgFiles: imgURLs, 
                    dateCreated: date
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
    
            const data = await response.json();
            setPosts(prevPosts => [...prevPosts, data]);
            setCaption('');
            setVideoFiles([]);
            setImgFiles([]);
            setShowForm(false);
            setMessage(null);
            getPosts();
        } catch (err) {
            console.error(err);
            setMessage('Error creating post');
        }
    };

    
    const getPosts = async () => {
        try {
            const response = await fetch('/climbs/getPosts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friends }),
            });
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error getting posts: ', error);
        }
    };
    
    const handleVideoFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("FILES", files);
        
        if (files.length + videoFiles.length > 1) {
            setMessage('You can only upload a maximum of 1 videos');
            return;
        }
        setVideoFiles(prev => [...prev, ...files]);
    
    };
    

    const handleImgFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + imgFiles.length > 1) {
            setMessage('You can only upload a maximum of 1 photos');
            return;
        }
        setImgFiles(prev => [...prev, ...files]);
    };

    const handleRemoveImage = (indexToRemove) => {
        setImgFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveVideo = (indexToRemove) => {
        setVideoFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    }

    
    
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
                                <label>Add Video</label>
                                <input
                                    type='file'
                                    accept="video/*"
                                    multiple
                                    onChange={handleVideoFileChange}
                                />
                            </div>
                            <div>
                            {videoFiles.map((file, index) => (
                                <div key={index} style={{ position:'relative', display:'inline-block'}}>
                                    <video key={index} width="180" height="120" controls>
                                        <source src={URL.createObjectURL(file)} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <button onClick={() => handleRemoveVideo(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '7px',
                                            right: '0px',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '25px',
                                            height: '25px',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            lineHeight: '25px'
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <button>
                                    
                                    </button>
                            </div>
                            <div>
                                <label>Add Image</label>
                                <input
                                    type='file'
                                    accept="image/*"
                                    multiple
                                    onChange={handleImgFileChange}
                                />
                            </div>
                            {imgFiles.map((file, index) => (
                                <div key={index} style={{ position: 'relative', display: 'inline-block', margin: '0px' }}>
                                    <img
                                        width="90"
                                        height="60"
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        style={{
                                            position: 'absolute',
                                            top: '-3px',
                                            right: '2px',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '20px',
                                            height: '20px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
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
                        {post.videoFiles || post.imgFiles || (
                            <div className="media-slider">
                                <button onClick={() => handlePrev(post._id)}>{"<"}</button>
                                {getCurrentMedia(post._id)}
                                <button onClick={() => handleNext(post._id)}>{">"}</button>
                            </div>
                        )}
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
                                        <button onClick={() => handleReplySubmit(comment._id)}>Reply</button>

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
