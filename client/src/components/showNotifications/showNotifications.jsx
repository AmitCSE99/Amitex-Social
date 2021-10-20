import React from "react";
import classes from "./showNotifications.module.css";
import { format } from "timeago.js";
import { useHistory } from "react-router-dom";
export default function ShowNotifications(props) {
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const goToPost = () => {
    if (props.data.messageType === 2) {
      history.push(`/post/${props.data.post._id}`);
    } else if (props.data.messageType === 3) {
      history.push(`/post/${props.data.post._id}`);
    } else if (props.data.messageType === 1) {
      history.push("/friendRequests");
    } else {
      history.push(`/profile/${props.data.user.username}`);
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.outerContainer} onClick={goToPost}>
        <div className={classes.imageContainer}>
          <img src={PF + "person/noAvatar.png"} alt="" />
        </div>
        {props.data.messageType === 0 && (
          <div className={classes.notificationDetailContainer}>
            <p>{props.data.user.name} accepted your follow request</p>
            <p className={classes.notificationDate}>
              {format(props.data.creationTime)}
            </p>
          </div>
        )}
        {props.data.messageType === 1 && (
          <div className={classes.notificationDetailContainer}>
            <p>{props.data.user.name} sent you a follow request</p>
            <p className={classes.notificationDate}>
              {format(props.data.creationTime)}
            </p>
          </div>
        )}
        {props.data.messageType === 2 && (
          <div className={classes.notificationDetailContainer}>
            {props.data.otherLikes === 0 && (
              <p>{props.data.user.name} liked your post</p>
            )}
            {props.data.otherLikes > 0 && (
              <p>
                {props.data.user.name} and {props.data.otherLikes} others liked
                your post
              </p>
            )}
            <p className={classes.notificationDate}>
              {format(props.data.creationTime)}
            </p>
          </div>
        )}
        {props.data.messageType === 3 && (
          <div className={classes.notificationDetailContainer}>
            {props.data.otherComments === 0 && (
              <p>{props.data.user.name} commented on your post</p>
            )}
            {props.data.otherComments > 0 && (
              <p>
                {props.data.user.name} and {props.data.otherComments} others
                commented on your post
              </p>
            )}
            <p className={classes.notificationDate}>
              {format(props.data.creationTime)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
