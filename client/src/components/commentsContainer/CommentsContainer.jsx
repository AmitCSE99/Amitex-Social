import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "./commentsContainer.css";
import { CircularProgress } from "@material-ui/core";
import AuthContext from "../../context/AuthContext";
export default function CommentsContainer(props) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  console.log(user.name);
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       setIsFetching(true);
  //       const response = await axios.get(`/user/?userId=${props.commentId}`);
  //       setUser(response.data.user);
  //       setIsFetching(false);
  //     } catch (err) {
  //       console.log(err);
  //       setIsFetching(false);
  //     }
  //   };
  //   fetchUser();
  // }, []);
  return (
    <div className="commentContainer">
      <img src={PF + "person/noAvatar.png"} alt="" className="commenterImage" />

      {props.newComment && (
        <div className="commenterDetails">
          <p className="commenterDetailsHeading">{user.name}</p>
          <p className="commenterDetailsComment">{props.commentText}</p>
        </div>
      )}

      {!props.newComment && (
        <div className="commenterDetails">
          <p className="commenterDetailsHeading">{props.commentUser.name}</p>
          <p className="commenterDetailsComment">{props.commentText}</p>
        </div>
      )}
    </div>
  );
}
