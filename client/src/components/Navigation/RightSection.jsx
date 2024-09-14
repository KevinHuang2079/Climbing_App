import React, { } from 'react';
import Contacts from './Contacts';
import '../../cssStuff/RightSection.scss';  



function RightSection ({ userID, username }) {
    const handleReccomended = () => {
        console.log("find Climbers Button");
    }


    return(
        <div className="RightSection">
            <div className='container'>
                <div className="Suggested">
                    <h2>Suggested Climbers</h2>
                    <span>Find new ways to connect with climbers in your community.</span>
                    <input 
                        className='findClimbersButton'
                        type="button"
                        onClick={handleReccomended}
                        value="Recommended Climbers"
                    />
                </div>

                <div className="Contacts"> 
                    <Contacts/>
                </div>
            </div>
        </div>
    )
}

export default RightSection;
