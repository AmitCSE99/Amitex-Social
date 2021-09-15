import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import "./login.css";
import AuthContext from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
export default function Login() {
  const history = useHistory();
  const email = useRef();
  const password = useRef();
  const { user, login, isFetching, error } = useContext(AuthContext);
  const handleClick = (e) => {
    e.preventDefault();
    console.log(email.current.value);
    console.log(password.current.value);
    login(email.current.value, password.current.value);
  };

  const goToRegisterScreenHandler = () => {
    history.replace("/register");
  };

  console.log(user);
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">AMITEX SOCIAL</h3>
          <span className="loginDesc">
            Connect with friends around the world using Amitex Social
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="email"
              ref={email}
              required
              placeholder="EMAIL"
              className="loginInput"
            />
            {error === "user not found" && (
              <span className="invalidText">The email is not present</span>
            )}
            <input
              type="password"
              ref={password}
              required
              minLength="6"
              placeholder="PASSWORD"
              className="loginInput"
            />
            {error === "Invalid Password" && (
              <div className="invalidPasswordContainer">
                <span className="invalidText">
                  The password is not correct!
                </span>
                <span className="loginForgot">Forgot Password</span>
              </div>
            )}
            {error !== "Invalid Password" && (
              <span className="loginForgot">Forgot Password</span>
            )}
            <button type="submit" className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px"></CircularProgress>
              ) : (
                "LOGIN"
              )}
            </button>

            <button
              className="loginRegisterButton"
              disabled={isFetching}
              onClick={goToRegisterScreenHandler}
            >
              {isFetching ? (
                <CircularProgress color="white" size="20px"></CircularProgress>
              ) : (
                "CREATE AN ACCOUNT"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
