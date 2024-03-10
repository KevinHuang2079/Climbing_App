import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssStuff/Login.scss';  


function Login({ Access, SetAccess }) {
    const [usernameInput, setUserName] = useState('');
    const [passwordInput, setPassword] = useState('');
    const [usernameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();


    const onButtonClick = () => {
        handleLogin();
    };


    const handleLogin = async () => {
        try {
            if (!usernameInput){
                setUserNameError('User not found');
            }
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usernameInput, passwordInput }),
            });

            console.log(response);
            if (!response.ok) {
                // Handle HTTP error response
                if (response.status === 401) {
                    console.log('Incorrect password');
                    setPasswordError('Incorrect password');
                } else if (response.status === 404) {
                    console.log('User not found');
                    setUserNameError('User not found');
                } else {
                    console.error('HTTP Error:', response.statusText);
                }
                return; // Exit from the function if there's an HTTP error
            }
            const data = await response.json();
            console.log('Login successful:', data);
            const userID = data._id;
            SetAccess(true);
            navigate(`/profile/home/${userID}`);
            
        } catch (error) {
            setPasswordError('Incorrect password');   
            console.error('Error logging in:', error);
        }
    };
    return (
        <div className="mainContainer">
            <div 
                className="titleContainer">
            </div>
            <br />
            <div className="usernameInput">
                <label className="errorLabel">{usernameError}
                    <input
                        value={usernameInput}
                        placeholder="Username or email"
                        onChange={(ev) => setUserName(ev.target.value)}
                        className="inputBox"
                    />
                </label>
            </div>
            <br />
            <div className="passwordInput">
                <label className="errorLabel">{passwordError}
                    <input
                        type="password"
                        value={passwordInput}
                        placeholder="Password"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className="inputBox"
                    />
                </label>
            </div>
            <br />
            <div className="inputContainer">
            <input 
                className="loginButton" 
                type="button" 
                onClick={onButtonClick} 
                value="Login" 
            />
            </div>

        </div>
    )
}

export default Login;