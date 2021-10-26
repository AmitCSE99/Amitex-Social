import React, { useEffect, useState } from "react";
import classes from "./searchFriends.module.css";
import ShowUsers from "../showUsers/showUsers";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";

export default function SearchFriends(props) {
  const [isFetching, setIsFetching] = useState(false);

  const [usersList, setUsersList] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(
          `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/user/findUsers/${props.username}`
        );
        setUsersList(response.data.users);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    fetchUsers();
  }, [props.username]);

  return (
    <div className={classes.findUsersSection}>
      <p className={classes.findUsersHeading}>Search Results</p>
      <div className={classes.findUsersFeed}>
        <div
          className={
            isFetching
              ? `${classes.fetchUsersListLoading}`
              : `${classes.fetchUsersList}`
          }
        >
          {/* <ShowUsers></ShowUsers>
              <ShowUsers></ShowUsers>
              <ShowUsers></ShowUsers> */}
          {!isFetching && usersList && usersList.length === 0 && (
            <div className={classes.noUserFound}>
              <p>No user found!</p>
            </div>
          )}
          {isFetching && <CircularProgress />}
          {!isFetching &&
            usersList &&
            usersList.map((u) => (
              <ShowUsers
                key={u._id}
                name={u.name}
                username={u.username}
              ></ShowUsers>
            ))}
        </div>
      </div>
    </div>
  );
}
