import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rightbar from "../../components/rightbar/Rightbar";
import ShowFollowersFollowingContainer from "../../components/show-followers-following-container/show-followers-following-container";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import AuthContext from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import "./followers.css";
import SearchFriends from "../../components/searchFriends/SearchFriends";

const Followers = () => {
  const { username } = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
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

  const [followers, setFollowers] = useState(null);
  const { user } = useContext(AuthContext);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/user/followers/${username}`
        );
        setFollowers(response.data.followers);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    fetchFollowers();
  }, [username]);

  console.log(followers);
  return (
    <>
      <Topbar
        setSearch={setSearch}
        stopSearch={stopSearch}
        setUserSearch={setUserSearch}
      ></Topbar>
      <div className="followers">
        <Sidebar></Sidebar>
        {!isUserSearching && (
          <div className="followersSection">
            {user.username === username && (
              <p className="followersHeading">Your Followers</p>
            )}
            {user.username !== username && (
              <p className="followersHeading">Followers</p>
            )}
            <div className="followersFeed">
              <div
                className={
                  isFetching ? "followersListLoading" : "followersList"
                }
              >
                {isFetching && <CircularProgress />}
                {!isFetching &&
                  followers &&
                  followers.map((f) => (
                    <ShowFollowersFollowingContainer follower={f} key={f._id} />
                  ))}
              </div>
            </div>
          </div>
        )}
        {isUserSearching && <SearchFriends username={usernameSearch} />}
        <Rightbar></Rightbar>
      </div>
    </>
  );
};
export default Followers;
