import React from 'react';

const Post = ({ name, username, caption, Content }) => {
    return (
        <div className='post'>
            <div className='post-header'>
                <h3>{name}</h3>
                <p>{username}</p>
            </div>
            <div className='post-caption'>
                <p>{caption}</p>
            </div>
            <div className='post-content'>
                {Content}
            </div>
        </div>
    );
};

export default Post;
