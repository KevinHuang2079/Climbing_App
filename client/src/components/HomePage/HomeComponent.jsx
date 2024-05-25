import React, { useState } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import '../../cssStuff/Home.scss';  

function Home({ Access, SetAccess}){
    const [showLogin, setShowLogin] = useState(true);

    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="home-container">
            <div className="card">
                <div className="left">
                    <h1>Morbius</h1>
                    <p>
                        I am who I am, I am who I am,
                        I am who I am, I am who I am,
                    </p>
                </div>
                <div className="right">
                    <div className="form-container">
                        {showLogin ? (
                            <div>
                                <h2>Login</h2>
                                <LoginComponent Access={Access} SetAccess={SetAccess} />
                                <p>Don't have an account? 
                                    <button 
                                        className="register-button" 
                                        onClick={toggleForm}
                                    >Register</button>
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h2>Register</h2>
                                <RegisterComponent Access={Access} SetAccess={SetAccess} />
                                <p>Already have an account? 
                                    <button 
                                        className="login-button" 
                                        onClick={toggleForm}
                                    >Login</button>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
    
      
      
}
      
    
export default Home;