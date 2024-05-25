import React, { useState, useContext } from 'react';
import Post from './Post.jsx';
import PostContent from './PostContent.jsx';
import { GlobalContext } from '../../GlobalContext';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    //const { userID } = useContext(GlobalContext);
    const { username } = useContext(GlobalContext);
    const { name } = useContext(GlobalContext);

    const handleAddPost = () => {
        // Simulate picking images and videos from local storage
        const images = ['image1.jpg'];
        const videos = ['video1.mp4'];

        const newPost = {
            id: posts.length + 1,
            name: name,
            username: "@"+username,
            text: 'Check out my latest adventure!',
            images: images,
            videos: videos,
        };

        setPosts([...posts, newPost]);
    };

    return (
        <div className='posts-section'>
            <h2>Home</h2>
            <button onClick={handleAddPost}>Add Post</button>
            {posts.map(post => (
                <Post
                    key={post.id}
                    name={post.name}
                    username={post.username}
                    text={post.text}
                    Content={<PostContent images={post.images} videos={post.videos} />}
                />
            ))}
            <div className='PostMenu'>
                
            </div>
        </div>  
    );
};

export default Posts;
