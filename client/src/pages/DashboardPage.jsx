import React from 'react';
import BuildDashboard from '../components/Dashboard/DashboardComponent';
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
