import React, { useState, useEffect, useContext } from 'react';
import TopSection from "../Navigation/TopSection";
import LeftSection from '../Navigation/LeftSection';
import RightSection from '../Navigation/RightSection';
import { GlobalContext } from '../../GlobalContext';
import Posts from "./Posts.jsx"
import '../../cssStuff/Dashboard.scss';

function BuildDashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userID } = useContext(GlobalContext);

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
        <div className='dashboard'>
            <TopSection userID={userID} username={userData.username} />
            <div style = {{display: "flex"}}> 
                <LeftSection userID={userID}/>
                <div className='posts' style={{ flex: 6}}>
                    <Posts />
                </div>
                <RightSection />
            </div>
        </div>
    );
}

export default BuildDashboard;
