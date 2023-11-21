import { useState } from "react";
import "./css/login.css";
import ForgetPass from "./Forget_pass";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

function App() {
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showForgetPassForm, setShowForgetPassForm] = useState(false);

  const database = [
    {
      username: "user1",
      password: "pass1"
    },
    {
      username: "user2",
      password: "pass2"
    }
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

 
  const handleForgetPassClose = () => {
    setShowForgetPassForm(false);
  };
  const handleSubmitLogin = (event) => {
    event.preventDefault();
    var { email, password } = event.target;
    fetch('http://localhost:3030/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
      .then(res => {
        if (res.status === 401) {
          setErrorMessages({ name: "email", message: errors.email });
          throw new Error("Email could not be found!");
        }
        else if (res.status === 402) {
          setErrorMessages({ name: "password", message: errors.password });
          throw new Error("Password wrong!");
        }  
        else if (res.status === 500) {
          throw new Error("Error");
        }
        else {
          return res.json();
        }
      })
      .then(resData => {
        setIsSubmitted(true);
      })
  };

  const handleSubmitSignup = (event) => {
    event.preventDefault();
    var { email, password, name } = event.target;
    fetch('http://localhost:3030/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        name: name.value
      })
    })
      .then(res => {
        if (res.status === 422) {
          throw new Error('Validation failed');
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
      })
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className={`container ${isSignUpMode ? 'sign-up-mode' : ''}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={isSignUpMode ? handleSubmitSignup : handleSubmitLogin} className={isSignUpMode ? 'sign-up-form' : 'sign-in-form'}>
            <h2 className="title">{isSignUpMode ? 'Sign up' : 'Sign in'}</h2>
            {!isSignUpMode && (
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" name="email" placeholder="Email" required />
                {renderErrorMessage("email")}
              </div>
            )}
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="password" placeholder="Password" required />
              {renderErrorMessage("password")}
            </div>
            {isSignUpMode && (
            <>
             <div className="input-field">
                  <i className="fas fa-user"></i>
                  <input type="text" name="name" placeholder="Name" required />
                  {renderErrorMessage("name")}
                </div>
                <div className="input-field"> 
                  <i className="fas fa-envelope"></i>
                  <input type="email" name="email" placeholder="Email" required />
                  {renderErrorMessage("email")}
                </div>
                </>
            )}
             {/* <a className="forget_pass" href="#!" onClick={handleForgetPassClick}>
              Forget password?
            </a> */}
            <Link to="/ForgetPass">Forgot Password?</Link>
             <input type="submit" value={isSignUpMode ? 'Sign up' : 'Login'} className="btn solid" />
            
          </form>
          <button className="btn transparent" onClick={isSignUpMode ? handleSignInClick : handleSignUpClick}>
            {isSignUpMode ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>Welcome to StudySpace</h3>
            <p>
            Distance doesn't matter, it's the meeting 
                         that matter the most.
            </p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img src={require('./img/log.svg').default} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Welcome to StudySpace</h3>
            <p>
            Easy to share my idea and connect everyone.
            </p>
            <button className="btn transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img src={require('./img/register.svg').default} className="image" alt="" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title"></div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
      {showForgetPassForm && (
        <div className="overlay">
          <div className="forget-pass-modal">
            <ForgetPass onClose={handleForgetPassClose} />
          </div>
        </div>
      )}
    </div>
  );
}


export default App;
