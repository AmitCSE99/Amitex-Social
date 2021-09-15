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

const Followers = () => {
  const { username } = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [followers, setFollowers] = useState(null);
  const { user } = useContext(AuthContext);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`/user/followers/${username}`);
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
      <Topbar></Topbar>
      <div className="followers">
        <Sidebar></Sidebar>
        <div className="followersSection">
          {user.username === username && (
            <p className="followersHeading">Your Followers</p>
          )}
          {user.username !== username && (
            <p className="followersHeading">Followers</p>
          )}
          <div className="followersFeed">
            <div
              className={isFetching ? "followersListLoading" : "followersList"}
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
        <Rightbar></Rightbar>
      </div>
    </>
  );
};
export default Followers;
