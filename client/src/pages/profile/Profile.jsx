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
import SearchFriends from "../../components/searchFriends/SearchFriends";

export default function Profile() {
  const [isUserSearching, setIsUserSearching] = useState(false);
  const [usernameSearch, setUsernameSearch] = useState(null);

  const setSearch = () => {
    setIsUserSearching(true);
  };

  const stopSearch = () => {
    setIsUserSearching(false);
  };

  const setUserSearch = (name) => {
    setUsernameSearch(name);
  };

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
  const [sendRequestLoading, setSendRequestLoading] = useState(false);
  const [sendAcceptRequestLoading, setSendAcceptRequestLoading] =
    useState(false);
  const [sendRejectRequestLoading, setSendRejectRequestLoading] =
    useState(false);
  const [requestRemoveLoading, setRequestRemoveLoading] = useState(false);
  const [stopFollowingRequestLoading, setStopFollowingRequestLoading] =
    useState(false);
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
          console.log(requests);
        } catch (err) {
          setIsFetching(false);
          console.log(err);
        }
      } else {
        setIsFetching(true);
      }
    };
    fetchUser();
  }, [username]);

  const handleClick = async () => {
    try {
      setSendRequestLoading(true);
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
      setSendRequestLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickAccept = async () => {
    setSendAcceptRequestLoading(true);
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
      setSendAcceptRequestLoading(false);
    } catch (err) {
      console.log(err);
      setSendAcceptRequestLoading(false);
    }
  };

  const handleClickReject = async () => {
    setSendRejectRequestLoading(true);
    try {
      await axios.put("/user/" + user._id + "/rejectRequest", {
        userId: currentUser._id,
      });
      const newRequestList = requests.filter(
        (uid) => uid.toString() !== user._id.toString()
      );
      RemoveRequest(newRequestList);
      setGotRequest(false);
      setSendRejectRequestLoading(false);
    } catch (err) {
      console.log(err);
      setSendRejectRequestLoading(false);
    }
  };

  const handleClickRemoveFollower = async () => {
    setRequestRemoveLoading(true);
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
      setRequestRemoveLoading(false);
    } catch (err) {
      console.log(err);
      setRequestRemoveLoading(false);
    }
  };

  const handleClickStopFollowing = async () => {
    setStopFollowingRequestLoading(true);
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
      setStopFollowingRequestLoading(false);
    } catch (err) {
      console.log(err);
      setStopFollowingRequestLoading(false);
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
      {currentUser && (
        <Topbar
          setSearch={setSearch}
          stopSearch={stopSearch}
          setUserSearch={setUserSearch}
        ></Topbar>
      )}
      {currentUser && (
        <div className="profile">
          <Sidebar></Sidebar>
          {!isUserSearching && (
            <div
              className={isFetching ? "profileRightLoading" : "profileRight"}
            >
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
                        <button
                          className="followButton"
                          disabled={
                            sendAcceptRequestLoading ||
                            sendAcceptRequestLoading ||
                            sendRequestLoading ||
                            requestRemoveLoading
                          }
                          onClick={handleClick}
                        >
                          {alreadyRequested &&
                            !sendRequestLoading &&
                            "Already Requested"}
                          {!alreadyRequested &&
                            !sendRequestLoading &&
                            "Send Follow Request"}
                          {sendRequestLoading && (
                            <CircularProgress color="white" size="20px" />
                          )}
                        </button>
                      )}
                    {!isFetching &&
                      username !== currentUser.username &&
                      followed && (
                        <button
                          className="followButton"
                          onClick={handleClickStopFollowing}
                          disabled={
                            sendAcceptRequestLoading ||
                            sendAcceptRequestLoading ||
                            stopFollowingRequestLoading ||
                            requestRemoveLoading
                          }
                        >
                          {stopFollowingRequestLoading ? (
                            <CircularProgress color="white" size="20px" />
                          ) : (
                            "Stop Following"
                          )}
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
                              disabled={
                                sendRejectRequestLoading ||
                                sendAcceptRequestLoading ||
                                sendRequestLoading ||
                                stopFollowingRequestLoading
                              }
                              onClick={handleClickAccept}
                            >
                              {sendAcceptRequestLoading ? (
                                <CircularProgress color="white" size="20px" />
                              ) : (
                                "Accept Request"
                              )}
                            </button>
                            <button
                              className="followButton"
                              disabled={
                                sendAcceptRequestLoading ||
                                sendRejectRequestLoading ||
                                sendRequestLoading ||
                                stopFollowingRequestLoading
                              }
                              onClick={handleClickReject}
                            >
                              {sendRejectRequestLoading ? (
                                <CircularProgress color="white" size="20px" />
                              ) : (
                                "Reject Request"
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    {username != currentUser.username && isFollower && (
                      <button
                        disabled={
                          requestRemoveLoading ||
                          sendRequestLoading ||
                          stopFollowingRequestLoading
                        }
                        className="followButton"
                        onClick={handleClickRemoveFollower}
                      >
                        {requestRemoveLoading ? (
                          <CircularProgress color="white" size="20px" />
                        ) : (
                          "Remove Follower"
                        )}
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
          )}
          {isUserSearching && <SearchFriends username={usernameSearch} />}
          <Rightbar></Rightbar>
        </div>
      )}
    </>
  );
}
