import "./post.css";
import { useContext, useEffect, useRef } from "react";
import { MoreVert } from "@material-ui/icons";
import { useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import CommentsContainer from "../commentsContainer/CommentsContainer";
import PostOptionsModal from "../../modals/PostOptionsModal";

export default function Post({ post }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCounter, setCommentCounter] = useState(post.comments.length);
  const [postDescription, setPostDescription] = useState(
    post.desc ? post.desc : ""
  );
  const [commentList, setCommentList] = useState(
    post.comments.sort((p1, p2) => {
      return new Date(p2.creationTime) - new Date(p1.creationTime);
    })
  );

  console.log(commentList);
  const [newComment, setNewComment] = useState(null);
  const [user, setUser] = useState({});
  const commentRef = useRef();

  const [viewComments, setViewComments] = useState(false);
  const { user: currentUser, socket } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const response = await axios.get(`/user/?userId=${post.userId}`);
  //     setUser(response.data.user);
  //     console.log(response);
  //   };
  //   fetchUser();
  // }, [post.userId, commentCounter]);
  const openModalHandler = () => {
    setModalIsOpen(true);
  };

  const closeModalHandler = () => {
    setModalIsOpen(false);
  };

  const likeHandler = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/posts/` +
          post._id +
          "/like",
        {
          userId: currentUser._id,
          postUserId: post.user._id,
        }
      );
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
    !isLiked &&
      currentUser._id !== post.user._id &&
      socket.emit("sendNotification", {
        senderId: currentUser._id + post._id,
        receiverId: post.user._id,
        type: 1,
      });
  };

  const showCommentsHandler = () => {
    setViewComments(true);
    setNewComment(null);
  };

  const commentSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log(commentRef.current.value);
      console.log(currentUser._id);
      const response = await axios.put(
        `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/posts/${post._id}/postComment`,
        {
          comment: commentRef.current.value,
          user: currentUser._id,
        }
      );
      console.log(response.data.commentObj);
      setCommentCounter(commentCounter + 1);
      commentRef.current.value = "";
      const newCommentUpdate = {
        comment: response.data.commentObj.comment,
        creationTime: response.data.commentObj.creationTime,
        user: currentUser,
      };
      let newCommentList = commentList;
      newCommentList.push(newCommentUpdate);
      setNewComment(response.data.commentObj);
      setCommentList(
        newCommentList.sort((p1, p2) => {
          return new Date(p2.creationTime) - new Date(p1.creationTime);
        })
      );
      currentUser._id !== post.user._id &&
        socket.emit("sendNotification", {
          senderId: currentUser._id + post._id,
          receiverId: post.user._id,
          type: 2,
        });
      console.log(newCommentList);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${post.user.username}`}>
              <img
                className="postProfileImage"
                src={
                  post.user.profilePicture
                    ? PF + post.user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{post.user.name}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight" onClick={openModalHandler}>
            <MoreVert></MoreVert>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{postDescription}</span>
          <img className="postImage" src={post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              alt=""
              onClick={likeHandler}
            />
            <img className="likeIcon" src={`${PF}heart.png`} alt="" />
            <div className="postLikeCounter">{like} people like it</div>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{commentCounter} comments</span>
          </div>
        </div>
        <form className="commentWrapper" onSubmit={commentSubmitHandler}>
          <Link to={`/profile/${user.username}`}>
            <img
              src={
                post.user.profilePicture
                  ? PF + post.user.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
              className="commentUserImage"
            />
          </Link>
          <div>
            <input
              placeholder="Write a comment..."
              className="commentInput"
              ref={commentRef}
              required
            />
          </div>
        </form>
        {/* <div className="commentContainer">
          <img
            src={PF + "person/noAvatar.png"}
            alt=""
            className="commenterImage"
          />
          <div className="commenterDetails">
            <p className="commenterDetailsHeading">Arpita Mallick</p>
            <p className="commenterDetailsComment">This is a comment</p>
          </div>
        </div> */}
        <p className="commentPostHeading">Press enter to post</p>
        {newComment && !viewComments && commentCounter > 0 && (
          <CommentsContainer
            commentText={newComment.comment}
            creationTime={newComment.creationTime}
            commentId={newComment.userId}
            newComment={true}
          />
        )}
        {!viewComments && commentCounter > 0 && (
          <span className="viewCommentsText" onClick={showCommentsHandler}>
            View all comments
          </span>
        )}
        {viewComments &&
          commentList.map((c, index) => (
            <CommentsContainer
              key={index}
              commentText={c.comment}
              commentUser={c.user}
              creationTime={c.creationTime}
              newComment={false}
            />
          ))}
      </div>
      <PostOptionsModal
        open={modalIsOpen}
        onClose={closeModalHandler}
        post={post}
      />
    </div>
  );
}
