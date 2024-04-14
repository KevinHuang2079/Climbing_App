import React from 'react';
import BuildSettings from '../components/SettingsComponent';
import { useParams } from 'react-router-dom';

function SettingsPage() {
    const { userID } = useParams();
    return (
    <div>
        <BuildSettings userID={userID}/>
    </div>
    );
}

export default SettingsPage;
