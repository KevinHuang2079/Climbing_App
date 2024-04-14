import React from 'react';
import BuildProfile from '../components/ProfileComponent';
import { useParams } from 'react-router-dom';

function ProfilePage() {
    const { userID, username } = useParams();
    return (
    <div>
        <BuildProfile userID={userID} username={username}/>
    </div>
    );
}

export default ProfilePage;
