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
  } = useContext(AuthContext);
  const username = useParams().username;
  const [followed, setFollowed] = useState(false);
  const [userFollowing, setUserFollowing] = useState(null);
  const [userFollowers, setUserFollowers] = useState(null);
  const [currentUserFollowing, setCurrentUserFollowing] = useState(null);
  const [currentUserFollowers, setCurrentUserFollowers] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
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
          setIsFetching(false);
          console.log(followed);
        } catch (err) {
          setIsFetching(false);
          console.log(err);
        }
      }
    };
    fetchUser();
  }, [username, followed]);

  // useEffect(() => {
  //   setFollowed(currentUser.following.includes(user?.id));
  // }, [currentUser, user.id]);
  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put("/user/" + user._id + "/unfollow", {
          userId: currentUser._id,
        });
        // dispatch({ type: "UNFOLLOW", payload: user._id });
        Unfollow(user._id);
      } else {
        await axios.put("/user/" + user._id + "/follow", {
          userId: currentUser._id,
        });
        Follow(user._id);
      }
      setFollowed(!followed);
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
                  {username !== currentUser.username && (
                    <button className="followButton" onClick={handleClick}>
                      {followed ? "Unfollow" : "Follow"}
                      {followed ? <Remove /> : <Add />}
                    </button>
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
