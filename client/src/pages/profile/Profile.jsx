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
    requests,
    followings,
    followers,
    Follow,
    Unfollow,
    logout,
    RemoveRequest,
    StopFollowing,
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
  const [isFollower, setIsFollower] = useState(false);
  const [iAmFollowing, setIamFollowing] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setIsFetching(true);
      if (currentUser) {
        console.log(followers);
        console.log(followings);
        console.log(requests);
        try {
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
          setCurrentUserFollowing(followings.length);
          setCurrentUserFollowers(followers.length);
          setFollowed(followings.includes(response.data.user._id));
          setIsFollower(followers.includes(response.data.user._id));
          console.log(isFollower);
          setAlreadyRequested(
            response.data.user.requests.includes(currentUser._id)
          );
          setGotRequest(requests.includes(response.data.user._id));

          setIsFetching(false);
          console.log(followed);
        } catch (err) {
          setIsFetching(false);
          console.log(err);
        }
      } else {
        setIsFetching(true);
      }
    };
    fetchUser();
  }, []);

  const handleClick = async () => {
    try {
      if (alreadyRequested) {
        await axios.put("/user/" + user._id + "/cancelRequest", {
          userId: currentUser._id,
        });
        setAlreadyRequested(!alreadyRequested);
      } else {
        await axios.put("/user/" + user._id + "/request", {
          userId: currentUser._id,
        });
        setAlreadyRequested(!alreadyRequested);
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
      const newFollowersList = [...followers, user._id];
      const newRequestList = requests.filter(
        (uid) => uid.toString() !== user._id.toString()
      );
      Follow(newFollowersList, newRequestList);
      let newUserFollowings = userFollowing + 1;
      setUserFollowing(newUserFollowings);
      setGotRequest(false);
      setIsFollower(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickReject = async () => {
    try {
      await axios.put("/user/" + user._id + "/rejectRequest", {
        userId: currentUser._id,
      });
      const newRequestList = requests.filter(
        (uid) => uid.toString() !== user._id.toString()
      );
      RemoveRequest(newRequestList);
      setGotRequest(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickRemoveFollower = async () => {
    try {
      await axios.put("/user/" + user._id + "/unfollow", {
        userId: currentUser._id,
      });
      const newFollowers = followers.filter((uid) => uid !== user._id);
      console.log(newFollowers);
      Unfollow(newFollowers);
      let newUserFollowings = userFollowing - 1;
      setUserFollowing(newUserFollowings);
      setIsFollower(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickStopFollowing = async () => {
    try {
      await axios.put("/user/" + user._id + "/stopFollowing", {
        userId: currentUser._id,
      });
      const newFollowings = followings.filter((uid) => uid !== user._id);
      StopFollowing(newFollowings);
      let newUserFollowers = userFollowers - 1;
      setUserFollowers(newUserFollowers);
      setAlreadyRequested(false);
      setFollowed(false);
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
      {!currentUser && isFetching && (
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
                  {!isFetching &&
                    username !== currentUser.username &&
                    !followed && (
                      <button className="followButton" onClick={handleClick}>
                        {alreadyRequested && "Already Requested"}
                        {!alreadyRequested && "Send Follow Request"}
                      </button>
                    )}
                  {!isFetching &&
                    username !== currentUser.username &&
                    followed && (
                      <button
                        className="followButton"
                        onClick={handleClickStopFollowing}
                      >
                        Stop Following
                      </button>
                    )}
                  {!isFetching &&
                    username !== currentUser.username &&
                    gotRequest && (
                      <div className="gotRequestOptions">
                        <p>
                          {user.name.split(" ")[0]} has sent you a follow
                          request
                        </p>
                        <div className="profileOptionsContainer">
                          <button
                            className="followButton"
                            onClick={handleClickAccept}
                          >
                            Accept Request
                          </button>
                          <button
                            className="followButton"
                            onClick={handleClickReject}
                          >
                            Reject Request
                          </button>
                        </div>
                      </div>
                    )}
                  {username != currentUser.username && isFollower && (
                    <button
                      className="followButton"
                      onClick={handleClickRemoveFollower}
                    >
                      Remove follower
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
