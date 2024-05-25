import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../cssStuff/Login.scss';  
import { GlobalContext } from '../../GlobalContext';


function Login({ Access, SetAccess }) {
    const [usernameInput, setUserNameInput] = useState('');
    const [passwordInput, setPassword] = useState('');
    const { userID, setUserID } = useContext(GlobalContext);
    const { setUsername } = useContext(GlobalContext);
    const { setName } = useContext(GlobalContext);
    let hasError = false;
    const [usernameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();


    const onButtonClick = () => {
        handleLogin();
    };


    const handleLogin = async () => {
        hasError = false;
        if (usernameInput.trim() === '') {
            setUserNameError('Enter Valid Username');
            hasError = true;
        } else {
        setUserNameError(''); 
        }
    
        if (passwordInput.trim() === '') {
            setPasswordError('Enter Valid Password');
            hasError = true;
        } else {
            setPasswordError('');
        }
        if (hasError){
            return;
        }
        else{
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
                    } else {
                        setPasswordError('Wrong Credentials');
                        console.error('HTTP Error:', response.statusText);
                    }
                    return; // Exit from the function if there's an HTTP error
                }
                const data = await response.json();
                console.log('Login successful:', data);
                setUserID(data._id);
                setUsername(data.username);
                setName(data.name);

                SetAccess(true);
                navigate(`/profile/dashboard/${userID}`);
                
            } catch (error) {
                console.error('Error logging in:', error);
            }
        }
    };
    return (
        <div className="mainContainer">
            <div 
                className="titleContainer">
            </div>
            <br />
            <div className="usernameInput">
                <input
                    value={usernameInput}
                    placeholder="Username or email"
                    onChange={(ev) => setUserNameInput(ev.target.value)}
                    className={`inputBox ${usernameError ? 'error' : ''}`}
                required/>
                {usernameError && <span className="errorLabel">{usernameError}</span>}
            </div>
            <br />
            <div className="passwordInput">
                <input
                    type="password"
                    value={passwordInput}
                    placeholder="Password"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={`inputBox ${passwordError ? 'error' : ''}`}
                required/>
                {passwordError && <span className="errorLabel">{passwordError}</span>}
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