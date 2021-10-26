import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

export default function Register() {
  const history = useHistory();
  const name = useRef();
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordMatchError, setPasswordMatchError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    if (passwordAgain.current.value !== password.current.value) {
      setPasswordMatchError("Passwords do not match");
      setIsFetching(false);
      return;
    } else {
      const user = {
        username: username.current.value,
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/auth/register`,
          user
        );
        console.log(response);
        if (response.data.message) {
          if (response.data.message === "username is already taken") {
            setUsernameError("This username is already taken!");
            setIsFetching(false);
          } else {
            setEmailError("This email is already taken!");
            setIsFetching(false);
          }
        } else {
          setIsFetching(false);
          history.replace("/login");
        }
      } catch (err) {
        console.log(err);
        setIsFetching(false);
      }
    }
  };

  const goToLoginScreenHandler = () => {
    history.replace("/login");
  };

  const inputChangeHandler = (e) => {
    setIsFetching(false);
    setUsernameError(null);
    setEmailError(null);
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">AMITEX SOCIAL</h3>
          <span className="registerDesc">
            Connect with friends around the world using Amitex Social
          </span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input
              type="text"
              placeholder="YOUR NAME"
              ref={name}
              className="registerInput"
              required
            />
            <input
              type="text"
              placeholder="USERNAME"
              ref={username}
              className="registerInput"
              required
              onChange={inputChangeHandler}
            />
            {usernameError && (
              <p className="registerErrorMessage">{usernameError}</p>
            )}
            <input
              type="email"
              placeholder="EMAIL"
              ref={email}
              required
              className="registerInput"
              onChange={inputChangeHandler}
            />
            {emailError && <p className="registerErrorMessage">{emailError}</p>}
            <input
              type="password"
              placeholder="PASSWORD"
              ref={password}
              required
              className="registerInput"
              minLength="6"
            />
            <input
              type="password"
              placeholder="CONFIRM PASSWORD"
              className="registerInput"
              required
              minLength="6"
              ref={passwordAgain}
            />
            {passwordMatchError && (
              <p className="registerErrorMessage">{passwordMatchError}</p>
            )}
            <button
              className="registerButton"
              type="submit"
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress color="white" size="20px"></CircularProgress>
              ) : (
                "SIGN UP"
              )}
            </button>
            <button
              disabled={isFetching}
              className="registerLoginButton"
              onClick={goToLoginScreenHandler}
            >
              {isFetching ? (
                <CircularProgress color="white" size="20px"></CircularProgress>
              ) : (
                "LOGIN TO YOUR ACCOUNT"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
