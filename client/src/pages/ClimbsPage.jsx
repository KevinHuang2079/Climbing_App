import React from 'react';
import ShowClimbs from '../components/ClimbsStuff/ClimbsComponent';
import { useParams } from 'react-router-dom';

function ClimbsPage() {
    const { userID } = useParams();
    return (
    <div>
        <ShowClimbs userID={userID}/>
    </div>
    );
}

export default ClimbsPage;
