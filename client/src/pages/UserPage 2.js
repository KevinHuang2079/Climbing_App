import React from 'react';
import BuildDashboard from '../components/UserComponent';
import { useParams } from 'react-router-dom';

function UserPage() {
    const { userID } = useParams();
    return (
    <div>
        <BuildDashboard userID={userID}/>
    </div>
    );
}

export default UserPage;
