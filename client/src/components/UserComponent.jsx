import React, { useState, useEffect } from 'react';
import TopSection from "./Dashboard/TopSection";
import LeftSection from './Dashboard/LeftSection';
import RightSection from './Dashboard/RightSection';
import MainSection from './Dashboard/MainSection';


function BuildDashboard({ userID }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user-specific data using userID
                const userResponse = await fetch(`/users/find/${userID}`);
                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }
                
                const userData = await userResponse.json();
                setUserData(userData[0]);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userID) {
            fetchUserData();
        }
    }, [userID]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>Error: Failed to load user data</div>;
    }


    return (
        <div>
            <TopSection userID={userID} username={userData.username} />
            <div style = {{display: "flex"}}> 
                <LeftSection />
                <div style={{ flex: 6}}>
                    <MainSection />
                </div>
                <RightSection />
            </div>
        </div>
    );



    
    
}

export default BuildDashboard;
