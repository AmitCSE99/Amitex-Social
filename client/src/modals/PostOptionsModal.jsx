import React, { useContext, useState } from "react";
import ReactDom from "react-dom";
import AuthContext from "../context/AuthContext";
import { useHistory } from "react-router-dom";
import "./postOptionsModal.css";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";
export default function PostOptionsModal({ open, onClose, post }) {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const [isFetching, setIsFetching] = useState(false);
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
  if (!open) return null;

  const editPostSubmitHandler = () => {
    console.log(user.username);
    console.log(post.user.username);
    // const data = {
    //   setEditedDescription,
    // };

    history.push(`/editPost/${post._id}`);
  };

  const unfollowUserHandler = async () => {
    setIsFetching(true);
    try {
      await axios.put("/user/" + currentUser._id + "/unfollow", {
        userId: post.user._id,
      });
      const newFollowers = followers.filter((uid) => uid !== user._id);
      console.log(newFollowers);
      Unfollow(newFollowers);
      let newUserFollowings = followings.length - 1;
      // setUserFollowing(newUserFollowings);
      // setIsFollower(false);
      setIsFetching(false);
      window.location.reload();
      alert("You have successfully unfollowed the user");
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
  };

  const deletePostHandler = async () => {
    console.log(post.public_url);
    const data = {
      postId: post._id,
      public_url: post.public_url,
    };
    setIsFetching(true);
    try {
      const response = await axios.delete(
        `/posts/deletePost/${post._id}/${post.public_url}`
      );
      setIsFetching(false);
      window.location.reload();
      alert("The Post has been deleted successfully");
    } catch (err) {
      console.log(err);
      setIsFetching(false);
    }
  };

  return ReactDom.createPortal(
    <>
      <div className="postOptionsModalOverlay" onClick={onClose}></div>
      <div className="postOptionsModal">
        <div className="outerOptionsModal">
          {user.username === post.user.username && (
            <div className="editPostOptionContainer">
              <div className="editPostOption">
                <h1>Edit Post</h1>
                <p>Made a Mistake in your Post? We got you covered :)</p>
                <button onClick={editPostSubmitHandler}>Edit Post</button>
              </div>
            </div>
          )}
          {user.username !== post.user.username && (
            <div className="reportPostContainer">
              <div className="reportPostOption">
                <h1>Report Post</h1>
                <p>Wanna Report this Post? Please share your feedback!</p>
                <button>Report Post</button>
              </div>
            </div>
          )}
          {user.username == post.user.username && (
            <div className="deletePostContainer">
              <div className="deletePostOption">
                <h1>Delete Post</h1>
                <p>Wanna Delete your post? We got you covered :)</p>
                <button onClick={deletePostHandler}>
                  {isFetching ? (
                    <CircularProgress color="white" size="20px" />
                  ) : (
                    "Delete Post"
                  )}
                </button>
              </div>
            </div>
          )}
          {user.username !== post.user.username && (
            <div className="unfollowUserPostContainer">
              <div className="unfollowUserPostOption">
                <h1>Unfollow User</h1>
                <p>
                  Don't wanna follow this user? Just click the button below :)
                </p>
                <button onClick={unfollowUserHandler}>
                  {isFetching ? (
                    <CircularProgress color="white" size="20px" />
                  ) : (
                    "Delete Post"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
