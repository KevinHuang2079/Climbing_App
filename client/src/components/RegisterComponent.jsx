import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../cssStuff/Register.scss';  

function Register() {
  const [usernameInput, setUserName] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [nameInput, setName] = useState('');
  const [emailInput, setEmail] = useState('');
  const [usernameError, setUserNameError] = useState('');
  const navigate = useNavigate();
  const onButtonClick = () => {
    handleRegister();
  };
  const handleRegister = async () => {
    try {
      // Proceed with registration if the user is not already registered
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameInput, emailInput, nameInput, passwordInput }),
      });

      if (!response.ok) {
        // Handle HTTP error response
        if (response.status === 409) {
            setUserNameError('Account taken, try different email or username');
        } else {
            console.error('HTTP Error:', response.statusText);
        }
        return; // Exit from the function if there's an HTTP error
      }
        const data = await response.json();
        console.log('Register successful:', data);
        const userID = data._id;
        navigate(`/profile/home/${userID}`);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="mainContainer">
        <br />
        <div className="usernameInput">
          <label className="errorLabel">{usernameError}
            <input
              value={usernameInput}
              placeholder="Username"
              onChange={(ev) => setUserName(ev.target.value)}
              className="inputBox"
            />
          </label>   
        </div>
        <br />
        <div className="passwordInput">
            <input
                type="password"
                value={passwordInput}
                placeholder="Password"
                onChange={(ev) => setPassword(ev.target.value)}
                className="inputBox"
            />
        </div>
        <br />
        <div className="emailInput">
            <input
                value={emailInput}
                placeholder="Email"
                onChange={(ev) => setEmail(ev.target.value)}
                className="inputBox"
            />
        </div>
        <br />
        <div className="nameInput">
            <input
                value={nameInput}
                placeholder="Full Name"
                onChange={(ev) => setName(ev.target.value)}
                className="inputBox"
            />
        </div>
        <br />
        <div className="buttonContainer">
          <input 
              className="registerButton" 
              type="button" 
              onClick={onButtonClick} 
              value="Register" 
          />
        </div>
    </div>
  )
}

export default Register;
