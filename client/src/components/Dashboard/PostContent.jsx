import React, { useState } from 'react';

const PostContent = ({ images, videos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const media = [...images.map(src => ({ type: 'image', src })), ...videos.map(src => ({ type: 'video', src }))];

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? media.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === media.length - 1 ? 0 : prevIndex + 1));
    };

    const renderMedia = () => {
        const currentMedia = media[currentIndex];
        if (currentMedia.type === 'image') {
            return <img src={currentMedia.src} alt={`Image ${currentIndex}`} style={{ maxWidth: '100%' }} />;
        } else if (currentMedia.type === 'video') {
            return <video src={currentMedia.src} controls style={{ maxWidth: '100%' }} />;
        }
        return null;
    };

    return (
        <div className='post-content'>
            <button onClick={handlePrev}>←</button>
            <div className='media-container'>
                {renderMedia()}
            </div>
            <button onClick={handleNext}>→</button>
        </div>
    );
};

export default PostContent;
