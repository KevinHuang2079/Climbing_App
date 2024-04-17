import React, { useState } from 'react';
import '../../cssStuff/TopSection.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faEnvelope, faMagnifyingGlass, faImagePortrait } from '@fortawesome/free-solid-svg-icons';

const TopSection = ({ userID, username }) => {
    const [Dropdown, setDropdown] = useState(false);

    const toggleDropdown = () => {
        setDropdown(!Dropdown);
    }

    return (
        <div className="TopSection">
            <div className="Left">
                <Link to={`/profile/dashboard/${userID}`}>   
                    <img src="https://images.vexels.com/media/users/3/131521/isolated/preview/a9a148c24c3df31eb153c25aa8287e0a-mountain-climbing-circle-icon.png" alt=""/> 
                    <span className="HomeSpan"> ClimbingApp </span>
                </Link> 
                <FontAwesomeIcon icon={faBars} /> 
                <div className="Search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> 
                    <input type="text" placeholder='Search...'/>
                </div>
            </div>
            <div className="Right">
                <div className="icons">
                    <FontAwesomeIcon icon={faImagePortrait} /> 
                    <FontAwesomeIcon icon={faEnvelope} /> 
                    <FontAwesomeIcon icon={faBell} /> 
                </div>
                <div className="User" onClick={toggleDropdown}>
                    <img src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg" alt=""/>
                    <span> {username} </span>

                </div>
                {Dropdown &&
                        <div className="Dropdown">
                            <Link to={`/profile/info/${userID}/${username}`} className="DropdownItem">
                                Profile
                            </Link>
                            <Link to={`/profile/settings/${userID}`} className="DropdownItem">
                                Settings
                            </Link>
                            <Link to={`/profile/climbs/${userID}`} className="DropdownItem">
                                Your Climbs
                            </Link>
                            <Link to={`/home`} className="DropdownItem">
                                Log Out
                            </Link>
                        </div>
                    }
            </div>
        </div>
    );  

}

export default TopSection;
