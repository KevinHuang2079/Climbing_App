import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

const Friend = ({userID}) =>{
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

    return (
        <div className="friend">
            <h3>{userData.username}</h3>
            {userData && (
                <div>
                    <p>User ID: {userData.id}</p>
                    <p>Email: {userData.email}</p>
                    <p>username: {userData.username}</p>
                </div>
            )}
        </div>
    );
    
}




export default Friend;
