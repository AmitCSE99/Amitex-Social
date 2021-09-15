import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import ShowFollowersFollowingContainer from "../../components/show-followers-following-container/show-followers-following-container";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import AuthContext from "../../context/AuthContext";
import "./followings.css";
const Followings = () => {
  const { username } = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [followings, setFollowings] = useState(null);
  const { user } = useContext(AuthContext);
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`/user/followings/${username}`);
        setFollowings(response.data.followings);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    fetchFollowings();
  }, [username]);

  console.log(followings);
  return (
    <>
      <Topbar></Topbar>
      <div className="followings">
        <Sidebar></Sidebar>
        <div className="followingsSection">
          {user.username === username && (
            <p className="followingsHeading">Your Followings</p>
          )}
          {user.username !== username && (
            <p className="followingsHeading">Followings</p>
          )}
          <div className="followingsFeed">
            <div
              className={
                isFetching ? "followingsListLoading" : "followingsList"
              }
            >
              {isFetching && <CircularProgress />}
              {!isFetching &&
                followings &&
                followings.map((f) => (
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
export default Followings;
