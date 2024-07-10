import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../cssStuff/Login.scss';  
import { GlobalContext } from '../../GlobalContext';

function Login({ Access, SetAccess }) {
    const [usernameInput, setUserNameInput] = useState('');
    const [passwordInput, setPassword] = useState('');
    const { setUserID, setUsername, setName } = useContext(GlobalContext);
    const [usernameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        let hasError = false;

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

        if (hasError) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({usernameInput, passwordInput }),
            });

            setLoading(false);

            if (!response.ok) {
                if (response.status === 401) {
                    setPasswordError('Incorrect password');
                } else {
                    setPasswordError('Wrong Credentials');
                    console.error('HTTP Error:', response.statusText);
                }
                return;
            }

            console.log(response);
            const data = await response.json();
            console.log(data);
            setUserID(data._id);
            setUsername(data.username);
            setName(data.name);

            SetAccess(true);
            navigate(`/profile/dashboard/${data._id}`);
        } catch (error) {
            setLoading(false);
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="mainContainer">
            <div className="titleContainer"></div>
            <br />
            <div className="usernameInput">
                <input
                    value={usernameInput}
                    placeholder="Username or email"
                    onChange={(ev) => setUserNameInput(ev.target.value)}
                    className={`inputBox ${usernameError ? 'error' : ''}`}
                    required
                />
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
                    required
                />
                {passwordError && <span className="errorLabel">{passwordError}</span>}
            </div>
            <br />
            <div className="inputContainer">
                <input
                    className="loginButton"
                    type="button"
                    onClick={handleLogin}
                    value="Login"
                    disabled={loading}
                />
                {loading && <span className="loadingLabel">Logging in...</span>}
            </div>
        </div>
    );
}

export default Login;
