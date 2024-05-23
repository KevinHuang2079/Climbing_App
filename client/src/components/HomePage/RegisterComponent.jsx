import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../cssStuff/Register.scss';  
import { GlobalContext } from '../../GlobalContext';

function Register({Access, SetAccess}) {
  const [usernameInput, setUserName] = useState('');
  const [passwordInput, setPassword] = useState('');
  const [nameInput, setName] = useState('');
  const [emailInput, setEmail] = useState('');
  const { userID, setUserID } = useContext(GlobalContext);

  let hasError = false;
  const [usernameError, setUserNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();


  const onButtonClick = () => {
    handleRegister();
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };


  const handleRegister = async () => {
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
  
    if (nameInput.trim() === '') {
      setNameError('Enter Valid Name');
      hasError = true;
    } else {
      setNameError('');
    }
  
    if (emailInput.trim() === '') {
      setEmailError('Enter an email address');
      hasError = true;
    } else if (!validateEmail(emailInput)) {
      setEmailError('Enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }
  
    //stop execution if there are any errors
    if (hasError) {
      return;
    } 
    else{
      try {
        //proceed with registration 
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usernameInput, emailInput, nameInput, passwordInput }),
        });
        const data = await response.json();
        //api call
        if (!response.ok) {
          if (response.status === 409) {
              setUserNameError('Account Taken');
              setEmailError('Account Taken');
          } 
          else {
              console.error('HTTP Error:', response.statusText);
          }
          return;
        }
        //successful registration
          console.log('Register successful:', data);
          setUserID(data._id);
          SetAccess(true);
          navigate(`/profile/dashboard/${userID}`);
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };


  return (
    <div className="mainContainer">
      <form action="/" method="GET"> 
        <br/>
        <div className="usernameInput">
          <input
              value={usernameInput}
              placeholder="Username"
              onChange={(ev) => setUserName(ev.target.value)}
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
        <div className="emailInput">
            <input
                value={emailInput}
                placeholder="Email"
                onChange={(ev) => setEmail(ev.target.value)}
                className={`inputBox ${emailError ? 'error' : ''}`}
            required/>
            {emailError && <span className="errorLabel">{emailError}</span>}
        </div>

        <br />
        <div className="nameInput">
            <input
                value={nameInput}
                placeholder="Full Name"
                onChange={(ev) => setName(ev.target.value)}
                className={`inputBox ${nameError ? 'error' : ''}`}
            required/>
            {nameError && <span className="errorLabel">{nameError}</span>}
        </div>

        <br />
        <div className="buttonContainer">
          <input 
              className="registerButton" 
              type="button" 
              onClick={onButtonClick} 
              value="Register" 
          required/>
        </div>

      </form>
    </div>
  )
}

export default Register;
