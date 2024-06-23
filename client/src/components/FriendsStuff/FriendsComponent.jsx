import React, {useState, useEffect} from 'react';
// import { Link } from 'react-router-dom';
import Friend from "./Friend.jsx"
import TopSection from "../Navigation/TopSection";
import LeftSection from '../Navigation/LeftSection';
import { useParams } from 'react-router-dom';
import '../../cssStuff/Friends.scss';


const FriendsComponent = () =>{
    const [loading, setLoading] = useState(true);
    const [FriendsData, setFriendsData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [FriendsList, setFriendsList] = useState([]);
    const { userID } = useParams();

    //FriendsData unused for now
    const getFriendsData = async() => {
        try{
            const Data = FriendsList.map(async (FriendID) =>{
                const response = await fetch(`/users/find/${FriendID}`);
                const responseData = await response.json();
                return responseData;
            });
            Promise.All(Data)
            .then((allData) =>{
                setFriendsData(allData.filter(Boolean));
            })
            .catch((error) => {
                console.error('Error fetching friends data:', error);
            });

        }
        catch (error) {
            console.error('Error fetching Friends data:', error);
        }
    }

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
                console.log(userData[0].friends);
                setFriendsList(userData[0].friends);
                getFriendsData();
            } catch (error) {
                console.error('Error fetching user data:', error);
            } 
            finally {
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
                <LeftSection userID={userID}/>
                <div className="container">
                    <div>
                        <h2>Friends List:</h2>
                        {FriendsList.map((friendID) => (
                            <Friend key={friendID} userID ={friendID}/>
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
    
}

export default FriendsComponent;
