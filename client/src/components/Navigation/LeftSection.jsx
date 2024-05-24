import React, { } from 'react';
import { Link } from 'react-router-dom';
import '../../cssStuff/LeftSection.scss';


const LeftSection = ({userID}) => {
    return(
        <div className="LeftSection">
            <div className="container">
                <div className="home">
                    <Link to={`/profile/dashboard/${userID}`}>   
                        <img src="https://ih1.redbubble.net/image.5356383745.5149/flat,750x,075,f-pad,750x1000,f8f8f8.jpg" alt="" />
                        <span> Home</span>
                    </Link>
                </div>
                <div className="explore">
                    <Link to={`/profile/dashboard/explore${userID}`}>   
                        <img src="https://media.tenor.com/3W-jeEA5pgsAAAAe/evaporate-disappear.png" alt="" />
                        <span> explore</span>
                    </Link>
                </div>
                <div className="friends">
                    <Link to={`/profile/dashboard/friends/${userID}`}>   
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_03OcEDRE21VyT0o0eb8n4o7fCnE_kYQ0Nlz1G6qwgA&s" alt="" />
                        <span> Friends</span>
                    </Link>
                </div>
                <div className="groups">
                    <Link to={`/profile/dashboard/${userID}/groups`}>   
                        <img src="https://content.imageresizer.com/images/memes/Cool-guy-emoji-meme-6.jpg" alt="" />
                        <span> Groups</span>
                    </Link>
                </div>
                <div className="climbs">
                    <Link to={`/profile/dashboard/${userID}/climbs`}>   
                        <img src="https://cdn3.emoji.gg/emojis/1634-shocked-guy.png" alt="" />
                        <span> Climbs</span>
                    </Link>
                </div>
            </div>
        </div>


    );
}

export default LeftSection;

