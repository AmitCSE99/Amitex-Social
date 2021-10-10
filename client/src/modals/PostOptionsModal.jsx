import React, { useContext } from "react";
import ReactDom from "react-dom";
import AuthContext from "../context/AuthContext";
import "./postOptionsModal.css";
export default function PostOptionsModal({ open, onClose, post }) {
  const { user } = useContext(AuthContext);
  if(!open) return null;

  const editPostSubmitHandler = () => {
    console.log(user.username);
    console.log(post.user.username);
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
                <button>Delete Post</button>
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
                <button>Delete Post</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
