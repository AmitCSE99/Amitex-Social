import React, { useContext } from "react";
import Rightbar from "../../components/rightbar/Rightbar";
import ShowUsers from "../../components/showUsers/showUsers";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import SearchFriends from "../../components/searchFriends/SearchFriends";
import classes from "./notifications.module.css";
import ShowNotifications from "../../components/showNotifications/showNotifications";

export default function Notifications() {
  const { user, requests, setNewNotifications, socket } =
    useContext(AuthContext);
  const [seenNotificationsList, setSeenNotificationsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [notSeenNotifications, setNotSeenNotifications] = useState([]);

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
          `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/user/${user._id}/fetchUserNotifications`
        );
        setSeenNotificationsList(response.data.seenNotifications);
        setNotSeenNotifications(response.data.notSeenNotifications);
        socket.emit("clearNotifications", user._id);
        setNewNotifications(0);
        console.log(response.data);
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
        {isFetching && (
          <div className={classes.notFoundNotifications}>
            <CircularProgress />
          </div>
        )}
        {!isFetching &&
          !isUserSearching &&
          notSeenNotifications.length === 0 &&
          seenNotificationsList.length === 0 && (
            <div className={classes.notFoundNotifications}>
              <p>No Notifications found</p>
            </div>
          )}
        {!isFetching && !isUserSearching && (
          <div className={classes.userRequests}>
            <p className={classes.requestsHeading}>Your Notifications</p>
            {!isFetching &&
              notSeenNotifications &&
              notSeenNotifications.length > 0 && (
                <div className={classes.findRequestsFeed}>
                  <p className={classes.newNotificationsHeading}>Recent</p>
                  <div
                    className={
                      isFetching
                        ? `${classes.fetchRequestsLoading}`
                        : `${classes.fetchRequestsList}`
                    }
                  >
                    {isFetching && <CircularProgress />}
                    {!isFetching &&
                      notSeenNotifications &&
                      notSeenNotifications.map((u) => (
                        <ShowNotifications
                          key={u._id}
                          data={u}
                        ></ShowNotifications>
                      ))}
                  </div>
                </div>
              )}
            {seenNotificationsList.length > 0 && (
              <div className={classes.findRequestsFeed}>
                <p className={classes.newNotificationsHeading}>Earlier</p>
                <div
                  className={
                    isFetching
                      ? `${classes.fetchRequestsLoading}`
                      : `${classes.fetchRequestsList}`
                  }
                >
                  {isFetching && <CircularProgress />}
                  {!isFetching &&
                    seenNotificationsList &&
                    seenNotificationsList.map((u) => (
                      <ShowNotifications
                        key={u._id}
                        data={u}
                      ></ShowNotifications>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        {isUserSearching && <SearchFriends username={usernameSearch} />}
        <Rightbar />
      </div>
    </>
  );
}
