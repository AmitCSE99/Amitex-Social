import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import { CircularProgress } from "@material-ui/core";
import { io } from "socket.io-client";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Fragment, useCallback, useEffect, useState } from "react";
import AuthContext from "./context/AuthContext";
import Followers from "./pages/Followers/Followers";
import Followings from "./pages/followings/followings";
import FindUsers from "./pages/findUsers/FindUsers";
import axios from "axios";
import FriendRequests from "./pages/friendRequests/FriendRequests";
import Notifications from "./pages/notifications/Notifications";
import GetPost from "./pages/getPost/GetPost";
import EditPost from "./pages/editPost/EditPost";

function App() {
  // const { user } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchAuth, setFetchAuth] = useState(false);
  const [followings, setFollowings] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(null);
  const [newNotificationsCounter, setNewNotificationsCounter] = useState(0);
  const [socketNotifications, setSocketNotifications] = useState(0);
  const [socket, setSocket] = useState(null);

  const login = useCallback((email, password) => {
    const loginUser = async () => {
      setFetchAuth(true);
      const response = await axios.post("/auth/login", {
        email: email,
        password: password,
      });
      if (!response.data.success) {
        setError(response.data.message);
        setFetchAuth(false);
      } else {
        const newResponse = await axios.get("/auth/validateToken", {
          params: {
            token: response.data.accessToken,
          },
        });
        console.log(newResponse.data.user);
        setUser(newResponse.data.user);
        setFollowings(newResponse.data.user.following);
        setFollowers(newResponse.data.user.followers);
        setRequests(newResponse.data.user.requests);
        setNewNotificationsCounter(newResponse.data.newNotifications);
        console.log(user);
        console.log(followers);
        localStorage.setItem("accessToken", response.data.accessToken);
        setFetchAuth(false);
      }
    };
    loginUser();
  });

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    setUser(null);
  });

  const Follow = useCallback((userId, newRequestList) => {
    setFollowers(userId);
    setRequests(newRequestList);
  }, []);

  const RemoveRequest = useCallback((userId) => {
    setRequests(userId);
  }, []);

  const Unfollow = useCallback((userId) => {
    setFollowers(userId);
  }, []);

  const StopFollowing = useCallback((newFollowingList) => {
    setFollowings(newFollowingList);
  });

  const ResetNotifications = useCallback((resetValue) => {
    setNewNotificationsCounter(resetValue);
    setSocketNotifications(resetValue);
  });

  const SettingSocketNotifications = useCallback((value) => {
    setSocketNotifications(value);
  });

  useEffect(() => {
    setSocket(io("https://amitex-social-socket.herokuapp.com/"));
    const getAndValidateUser = async () => {
      setIsFetching(true);
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get("/auth/validateToken", {
        params: {
          token: accessToken,
        },
      });

      if (response.data.success) {
        console.log(response.data.user.followers);
        setUser(response.data.user);
        setFollowings(response.data.user.following);
        setRequests(response.data.user.requests);
        setFollowers(response.data.user.followers);
        setNewNotificationsCounter(response.data.newNotifications);
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

  useEffect(() => {
    user && socket?.emit("newUser", user);
  }, [socket, user]);

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
            newNotifications: newNotificationsCounter,
            socket: socket,
            socketNotifications: socketNotifications,
            setSocketNotifications: SettingSocketNotifications,
            setNewNotifications: ResetNotifications,
            login: login,
            logout: logout,
            Follow: Follow,
            Unfollow: Unfollow,
            RemoveRequest: RemoveRequest,
            StopFollowing: StopFollowing,
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
              <Route path="/post/:id">
                {user === null ? <Login /> : <GetPost />}
              </Route>
              <Route path="/editPost/:id">
                {user === null ? <Login /> : <EditPost />}
              </Route>
              <Route path="/friendRequests">
                {user === null ? <Login /> : <FriendRequests />}
              </Route>
              <Route path="/notifications">
                {user === null ? <Login /> : <Notifications />}
              </Route>
            </Switch>
          </Router>
        </AuthContext.Provider>
      )}
    </Fragment>
  );
}

export default App;
