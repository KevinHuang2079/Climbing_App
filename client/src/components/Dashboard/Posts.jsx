import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Posts = () => {
    const [posts, setPosts] = useState([]);

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

    return (
        <div className='posts-section'>
            <h2>Posts</h2>
            <div className='posts-list'>
                {posts.map((post, index) => (
                    <div key={index} className='post'>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        {/* Render other post details */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Posts;
