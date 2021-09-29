import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import "./profile.css";
import AuthContext from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

export default function Profile() {
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const {
    user: currentUser,
    Follow,
    Unfollow,
    logout,
    RemoveRequest,
  } = useContext(AuthContext);
  const username = useParams().username;
  const [followed, setFollowed] = useState(false);
  const [userFollowing, setUserFollowing] = useState(null);
  const [userFollowers, setUserFollowers] = useState(null);
  const [currentUserFollowing, setCurrentUserFollowing] = useState(null);
  const [currentUserFollowers, setCurrentUserFollowers] = useState(null);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [gotRequest, setGotRequest] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [iAmFollowing, setIamFollowing] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser) {
        try {
          setIsFetching(true);
          const accessToken = localStorage.getItem("accessToken");
          const response = await axios.get(`/user/?username=${username}`, {
            params: {
              token: accessToken,
            },
          });
          if (!response.data.success) {
            console.log(response.data.success);
            logout();
          }
          setUser(response.data.user);
          console.log(response.data.user);
          setUserFollowing(response.data.user.following.length);
          setUserFollowers(response.data.user.followers.length);
          const responseUser = await axios.get(
            `/user/?userId=${currentUser._id}`,
            {
              params: {
                token: accessToken,
              },
            }
          );
          if (!responseUser.data.success) {
            console.log(responseUser.data.success);
            logout();
          }
          setCurrentUserFollowing(responseUser.data.user.following.length);
          setCurrentUserFollowers(responseUser.data.user.followers.length);
          setFollowed(responseUser.data.user.following.includes(user._id));
          console.log(followed);
          console.log(response.data.user.followers);
          setAlreadyRequested(
            response.data.user.requests.includes(currentUser._id)
          );
          setGotRequest(
            responseUser.data.user.requests.includes(response.data.user._id)
          );
          console.log(currentUser);
          console.log(currentUser.requests);
          console.log(alreadyRequested);
          console.log(gotRequest);
          setIsFetching(false);
          console.log(followed);
        } catch (err) {
          setIsFetching(false);
          console.log(err);
        }
      }
    };
    fetchUser();
  }, [username, user._id, followed, alreadyRequested, gotRequest]);

  // useEffect(() => {
  //   setFollowed(currentUser.following.includes(user?.id));
  // }, [currentUser, user.id]);
  const handleClick = async () => {
    try {
      if (alreadyRequested) {
        await axios.put("/user/" + user._id + "/cancelRequest", {
          userId: currentUser._id,
        });
        setAlreadyRequested(false);
        // dispatch({ type: "UNFOLLOW", payload: user._id });
        // Unfollow(user._id);
      } else {
        await axios.put("/user/" + user._id + "/request", {
          userId: currentUser._id,
        });
        setAlreadyRequested(true);
        // Follow(user._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickAccept = async () => {
    try {
      await axios.put("/user/" + user._id + "/acceptRequest", {
        userId: currentUser._id,
      });
      RemoveRequest(user._id);
      setGotRequest(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickReject = async () => {
    try {
      await axios.put("/user/" + user._id + "/rejectRequest", {
        userId: currentUser._id,
      });
      RemoveRequest(user._id);
      setGotRequest(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getFollowersHandler = (queryUsername) => {
    history.push(`/followers/${queryUsername}`);
  };

  const getFollowingsHandler = (queryUsername) => {
    history.push(`/followings/${queryUsername}`);
  };

  return (
    <>
      {!currentUser && (
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
      {currentUser && <Topbar></Topbar>}
      {currentUser && (
        <div className="profile">
          <Sidebar></Sidebar>
          <div className={isFetching ? "profileRightLoading" : "profileRight"}>
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
            {!isFetching && user && (
              <div className="profileRightTop">
                <div className="profileCover">
                  <img
                    className="profileCoverImage"
                    src={
                      user.coverPicture
                        ? user.coverPicture
                        : PF + "person/noCover.png"
                    }
                    alt=""
                  />
                  <img
                    className="profileUserImage"
                    src={
                      user.profilePicture
                        ? user.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                </div>
                <div className="profileInfo">
                  <h4 className="profileInfoName">{user.name}</h4>
                  <span className="profileInfoDesc">@{user.username}</span>
                  <span className="profileInfoDesc">{user.desc}</span>
                  {username !== currentUser.username && !followed && (
                    <button className="followButton" onClick={handleClick}>
                      {alreadyRequested && !followed && "Already Requested"}
                      {!alreadyRequested && !followed && "Send Follow Request"}
                      {/* {followed ? "Unfollow" : "Follow"}
                      {followed ? <Remove /> : <Add />} */}
                      {/* {followed && "Unfollow"} */}
                    </button>
                  )}
                  {username !== currentUser.username && gotRequest && (
                    <div className="gotRequestOptions">
                      <p>The user has sent you follow request</p>
                      <div className="profileOptionsContainer">
                        <button
                          className="followButton"
                          onClick={handleClickAccept}
                        >
                          Accept Request
                          {/* {followed ? "Unfollow" : "Follow"}
                      {followed ? <Remove /> : <Add />} */}
                        </button>
                        <button
                          className="followButton"
                          onClick={handleClickReject}
                        >
                          Reject Request
                          {/* {followed ? "Unfollow" : "Follow"}
                      {followed ? <Remove /> : <Add />} */}
                        </button>
                      </div>
                    </div>
                  )}

                  {username === currentUser.username && (
                    <div className="profileEditor">
                      <button
                        className="followButton followButtonStyle"
                        onClick={() =>
                          getFollowersHandler(currentUser.username)
                        }
                      >
                        {currentUserFollowers} followers
                      </button>
                      <button
                        className="followButton followButtonStyle"
                        onClick={() =>
                          getFollowingsHandler(currentUser.username)
                        }
                      >
                        {currentUserFollowing} following
                      </button>
                    </div>
                  )}
                  {username !== currentUser.username && (
                    <div className="profileEditor">
                      <button
                        className="followButton"
                        onClick={() => getFollowersHandler(username)}
                      >
                        {userFollowers} followers
                      </button>
                      <button
                        className="followButton"
                        onClick={() => getFollowingsHandler(username)}
                      >
                        {userFollowing} following
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!isFetching && (
              <div className="profileRightBottom">
                <Feed username={username} profile={true}></Feed>
              </div>
            )}
          </div>
          <Rightbar></Rightbar>
        </div>
      )}
    </>
  );
}
