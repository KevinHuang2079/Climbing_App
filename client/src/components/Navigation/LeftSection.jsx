import React, { } from 'react';
import { Link } from 'react-router-dom';
import '../../cssStuff/LeftSection.scss';


const LeftSection = ({userID}) => {
    
    return(
        <div className="LeftSection">
            <div className="container">
                <div className="home">
                    <Link to={`/profile/dashboard/${userID}`}>   
                        <img src="https://www.creativefabrica.com/wp-content/uploads/2019/02/Home-Icon-by-arus-2.jpg" alt="" />
                        <span> Home</span>
                    </Link>
                </div>
                <div className="friends">
                    <Link to={`/profile/dashboard/${userID}/friends`}>   
                        <img src="https://icons.veryicon.com/png/o/application/awesome-common-free-open-source-icon/user-friends-1.png" alt="" />
                        <span> Friends</span>
                    </Link>
                </div>
                <div className="groups">
                    <Link to={`/profile/dashboard/${userID}/groups`}>   
                        <img src="https://www.creativefabrica.com/wp-content/uploads/2019/02/Group-Icon-by-Kanggraphic-580x386.jpg" alt="" />
                        <span> Groups</span>
                    </Link>
                </div>
                <div className="climbs">
                    <Link to={`/profile/dashboard/${userID}/climbs`}>   
                        <img src="https://cdn1.iconfinder.com/data/icons/hands-pt-6/100/001_-_shaka-512.png" alt="" />
                        <span> Climbs</span>
                    </Link>
                </div>
            </div>
        </div>


    );
}

export default LeftSection;

