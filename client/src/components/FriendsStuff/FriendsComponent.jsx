import React from 'react';
import { Link } from 'react-router-dom';
import Friend from "./Friend.jsx"
// import '../../cssStuff/FriendsPage.scss';

const FriendsComponent = ({userID}) =>{
    const [Friends, setFriends] = useState([]);

    const addFriend = () =>{
        const newFriend = {
            //TODO
            //get id (look at loginComponent)
            //get name (get through query through id)
            //load img 
        };
        setFriends([...Friends, newFriend]);
    }
    const removeFriend = () => {
        
    }
    const lookUpFriend = () => {

    }

    return(
        <div className ="container">
            
        </div>

    );
}

export default FriendsComponent;
