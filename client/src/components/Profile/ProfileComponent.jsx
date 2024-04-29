import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopSection from "../Navigation/TopSection";
import LeftSection from '../Navigation/LeftSection';
import RightSection from '../Navigation/RightSection';
import '../../cssStuff/Profile.scss'

const BuildProfile = ({ userID }) => {
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
            <div style={{ display: "flex" }}>
                <LeftSection />
                <div style={{ flex: 6 }}>
                    <div className="Profile">
                        <div className='User'>
                            <img src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt=""/>
                            <span>{userData.username}</span>
                            <div className="FollowSection">
                                <Link to={`/profile/info/${userID}/${userData.username}/followers`} className="followers"> 
                                    Followers
                                </Link>
                                <Link to={`/profile/info/${userID}/${userData.username}/following`} className="following"> 
                                    Following
                                </Link>
                            </div>
                        </div>
                        <div className="Activity">
                            <div className="PopularActivity">
                                <h2>Popular Climbs</h2>
                                <ul>
                                    {/* Render list items dynamically here */}
                                </ul>
                            </div>
                            <div className="RecentActivity">
                                <h2>Recent Climbs</h2>
                                <ul>
                                    {/* Render list items dynamically here */}
                                </ul>
                            </div>  
                        </div>
                    </div>
                </div>
                <RightSection />
            </div>
        </div>
    );
    



    
    
}

export default BuildProfile;
