import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../cssStuff/LeftSection.scss';


const LeftSection = () => {
    return(
        <div className="LeftSection">
            <div className="container">
                <div className="menu">
                    <div className="item">
                        <img src="https://www.creativefabrica.com/wp-content/uploads/2019/02/Home-Icon-by-arus-2.jpg" alt="" />
                        <span> Home</span>
                    </div>
                    <div className="item">
                        <img src="https://icons.veryicon.com/png/o/application/awesome-common-free-open-source-icon/user-friends-1.png" alt="" />
                        <span> Friends</span>
                    </div>
                    <div className="item">
                        <img src="https://www.creativefabrica.com/wp-content/uploads/2019/02/Group-Icon-by-Kanggraphic-580x386.jpg" alt="" />
                        <span> Groups</span>
                    </div>
                    <div className="item">
                        <img src="https://cdn1.iconfinder.com/data/icons/hands-pt-6/100/001_-_shaka-512.png" alt="" />
                        <span> Climbs</span>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default LeftSection;

