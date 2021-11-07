import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import classes from "./showLikersModal.module.css";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

export default function ShowLikersModal({ open, onClose, postId }) {
  if (!open) return null;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [likers, setLikers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchLikers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/posts/${postId}/fetchLikes`
        );
        setLikers(response.data.likes);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    };
    fetchLikers();
  }, []);
  return ReactDom.createPortal(
    <>
      <div className={classes.showLikersModalOverlay} onClick={onClose}></div>
      <div className={classes.showLikersModal}>
        {isLoading && (
          <div className={classes.loader}>
            <CircularProgress color="white" size="20px" />
          </div>
        )}
        {!isLoading && likers && likers.length === 0 && (
          <div className={classes.noLikers}>
            <p>No Likes found!</p>
          </div>
        )}
        {!isLoading && likers && (
          <ul className={classes.showLikersOuterContainer}>
            {likers.map((liker) => (
              <li className={classes.showLikersContainer} key={liker._id}>
                <img
                  src={
                    liker.profilePicture
                      ? PF + post.user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                <p>{liker.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>,
    document.getElementById("portal")
  );
}
