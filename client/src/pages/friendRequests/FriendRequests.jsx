import React, { useContext } from "react";
import Rightbar from "../../components/rightbar/Rightbar";
import ShowUsers from "../../components/showUsers/showUsers";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./friendRequests.module.css";
import AuthContext from "../../context/AuthContext";
import SearchFriends from "../../components/searchFriends/SearchFriends";

export default function FriendRequests() {
  const { user, requests } = useContext(AuthContext);
  const [requestList, setRequestsList] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/user/${user._id}/getRequests`
        );
        setRequestsList(response.data.requests);
        console.log(response.data.requests);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    fetchRequests();
  }, []);

  return (
    <>
      <Topbar
        setSearch={setSearch}
        stopSearch={stopSearch}
        setUserSearch={setUserSearch}
      />
      <div className={classes.outerContainer}>
        <Sidebar />
        {!isUserSearching && (
          <div className={classes.userRequests}>
            <p className={classes.requestsHeading}>Your Requests</p>
            <div className={classes.findRequestsFeed}>
              <div
                className={
                  isFetching
                    ? `${classes.fetchRequestsLoading}`
                    : `${classes.fetchRequestsList}`
                }
              >
                {!isFetching && requestList && requestList.length === 0 && (
                  <div className={classes.noUserFound}>
                    <p>No user found!</p>
                  </div>
                )}
                {isFetching && <CircularProgress />}
                {!isFetching &&
                  requestList &&
                  requestList.map((u) => (
                    <ShowUsers
                      key={u._id}
                      name={u.name}
                      username={u.username}
                      id={u._id}
                      isRequest={true}
                    ></ShowUsers>
                  ))}
              </div>
            </div>
          </div>
        )}
        {isUserSearching && <SearchFriends username={usernameSearch} />}
        <Rightbar />
      </div>
    </>
  );
}
