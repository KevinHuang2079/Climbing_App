import React from 'react';
import BuildDashboard from '../components/DashboardComponent';
import { useParams } from 'react-router-dom';

function DashboardPage() {
    const { userID } = useParams();
    return (
    <div>
        <BuildDashboard userID={userID}/>
    </div>
    );
}

export default DashboardPage;
