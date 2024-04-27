import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Friend from "./Friend.jsx"
import TopSection from "../Navigation/TopSection";
import LeftSection from '../Navigation/LeftSection';
import RightSection from '../Navigation/RightSection';
// import '../../cssStuff/FriendsPage.scss';


const FriendsComponent = ({userID}) =>{
    const [Friends, setFriends] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                //Fetch user-specific data using userID 
                //TODO friends too along with userData(should be an attribute of user)
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
                <RightSection />
            </div>
        </div>
    );
    
}

export default FriendsComponent;
