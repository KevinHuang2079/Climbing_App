import React, { useState } from 'react';
import Post from './Post.jsx';
import PostContent from './PostContent.jsx';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    const handleAddPost = () => {
        // Simulate picking images and videos from local storage
        const images = ['image1.jpg'];
        const videos = ['video1.mp4'];

        const newPost = {
            id: posts.length + 1,
            name: 'John Doe',
            username: 'john.doe@example.com',
            caption: 'Check out my latest adventure!',
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
                    caption={post.caption}
                    Content={<PostContent images={post.images} videos={post.videos} />}
                />
            ))}
        </div>
    );
};

export default Posts;
