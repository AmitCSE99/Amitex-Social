import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { CircularProgress } from "@material-ui/core";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "./context/AuthContext";
import Followers from "./pages/Followers/Followers";
import Followings from "./pages/followings/followings";
import FindUsers from "./pages/findUsers/FindUsers";
import axios from "axios";

function App() {
  // const { user } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchAuth, setFetchAuth] = useState(false);
  const [followings, setFollowings] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(null);

  const login = useCallback((email, password) => {
    const loginUser = async () => {
      setFetchAuth(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: email,
          password: password,
        }
      );
      if (!response.data.success) {
        setError(response.data.message);
        setFetchAuth(false);
      } else {
        const newResponse = await axios.get(
          "http://localhost:5000/api/auth/validateToken",
          {
            params: {
              token: response.data.accessToken,
            },
          }
        );
        console.log(newResponse.data.user);
        setUser(newResponse.data.user);
        setFollowings(newResponse.data.user.following);
        setFollowers(newResponse.data.user.followers);
        setRequests(newResponse.data.user.requests);
        console.log(user);
        console.log(followers);
        localStorage.setItem("accessToken", response.data.accessToken);
        setFetchAuth(false);
      }
    };
    loginUser();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
  }, []);

  const Follow = useCallback((userId) => {
    // console.log("Before: ", followers);
    // let updateFollowers = followers;
    // updateFollowers.push(userId);
    // console.log("After: ", followers);
    setFollowers(userId);
  }, []);

  const RemoveRequest = useCallback((userId) => {
    // let updateRequests = requests;
    // updateRequests = requests.filter(uid =>
    //   uid.toString() !== userId.toString()
    // );
    // console.log(updateRequests);
    setRequests(userId);
  }, []);

  const Unfollow = useCallback((userId) => {
    // console.log("Before: ", followers);
    // let updateFollowers = followers;
    // updateFollowers.filter((uid) => {
    //   return uid !== userId;
    // });
    // console.log(updateFollowers);
    setFollowers(userId);
  }, []);

  useEffect(() => {
    const getAndValidateUser = async () => {
      setIsFetching(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://localhost:5000/api/auth/validateToken",
        {
          params: {
            token: accessToken,
          },
        }
      );
      if (response.data.success) {
        console.log(response.data.user.followers);
        setUser(response.data.user);
        setFollowings(response.data.user.following);
        setRequests(response.data.user.requests);
        setFollowers(response.data.user.followers);
        console.log(requests);
        console.log(followings);
        console.log(user);
        setIsFetching(false);
      } else {
        setUser(null);
        setIsFetching(false);
      }
    };
    getAndValidateUser();
  }, []);

  return (
    <Fragment>
      {isFetching && (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress></CircularProgress>
        </div>
      )}
      {!isFetching && (
        <AuthContext.Provider
          value={{
            user: user,
            error: error,
            isFetching: fetchAuth,
            requests: requests,
            followers: followers,
            followings: followings,
            login: login,
            logout: logout,
            Follow: Follow,
            Unfollow: Unfollow,
            RemoveRequest: RemoveRequest,
          }}
        >
          <Router>
            <Switch>
              <Route exact path="/">
                {user ? <Home /> : <Login />}
              </Route>
              <Route path="/login">
                {user ? <Redirect to="/" /> : <Login />}
              </Route>
              <Route path="/register">
                {user ? <Redirect to="/" /> : <Register />}
              </Route>
              <Route path="/profile/:username">
                {user === null ? <Login /> : <Profile />}
              </Route>
              <Route path="/followers/:username">
                {user === null ? <Login /> : <Followers />}
              </Route>
              <Route path="/followings/:username">
                {user === null ? <Login /> : <Followings />}
              </Route>
              <Route path="/findUsers/:name">
                {user === null ? <Login /> : <FindUsers />}
              </Route>
            </Switch>
          </Router>
        </AuthContext.Provider>
      )}
    </Fragment>
  );
}

export default App;
