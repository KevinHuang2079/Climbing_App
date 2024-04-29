import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Friend from "./Friend.jsx"
import TopSection from "../Navigation/TopSection";
import LeftSection from '../Navigation/LeftSection';
import RightSection from '../Navigation/RightSection';
import MainSection from '../Navigation/MainSection';
// import '../../cssStuff/FriendsPage.scss';


const FriendsComponent = ({userID}) =>{
    const [Friends, setFriends] = useState([]);
    const [userData, setUserData] = useState(null);
    const [friendsList, setFriendsList] = useState([]);

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
            } 
        };

        if (userID) {
            fetchUserData();
        }
    }, [userID]);

    if (!userData) {
        return <div>Error: Failed to load user data</div>;
    }

    

    return (
        <div>
            <TopSection userID={userID} username={userData.username} />
            <div style={{ display: "flex" }}>
                <LeftSection />
                <div className="container">
                    <h2>Friends</h2>
                    <div className="FriendsList">
                        {friendsList.map(friend => ( //make a component of every friend in friendsList
                            <Friend
                                key={friend.id}
                            />
                        ))}
                    </div>
                </div>
                <div style={{ flex: 6}}>
                    <MainSection />
                </div>
                <RightSection />
            </div>
        </div>
    );
    
}

export default FriendsComponent;
