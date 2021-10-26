import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import { useContext, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { useHistory } from "react-router-dom";

export default function Share(props) {
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [description, setDescription] = useState(
    props.post ? props.post.desc : ""
  );
  const [isFetching, setIsFetching] = useState(false);
  const [image, setImage] = useState(null);

  const onChangeHandler = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertIntoBase64(file);
    setImage(base64);
  };

  const convertIntoBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    const newPost = {
      user: user._id,
      desc: description,
      img: image,
    };
    // if (file) {
    //   console.log(file);
    //   const data = new FormData();
    //   const fileName = Date.now() + file.name;
    //   data.append("file", file);
    //   data.append("name", fileName);
    //   // newPost.img = fileName;
    //   try {
    //     const response = await axios.post("/upload", data);
    //     console.log(response);
    //     newPost.img = response.data.name;
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    try {
      await axios.post(
        `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/posts`,
        newPost
      );
      setIsFetching(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const editPostSubmitHandler = async (e) => {
    e.preventDefault();
    const editedPost = {
      postId: props.post._id,
      desc: description,
    };
    setIsFetching(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/posts/editPost`,
        editedPost
      );
      setIsFetching(false);
      props.editedPostHandler();
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  const descriptionChangedHandler = (e) => {
    setDescription(e.target.value);
  };
  console.log(description);
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImage"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.name.split(" ")[0]}
            className="shareInput"
            onChange={descriptionChangedHandler}
            value={description}
          />
        </div>
        <hr className="shareHr" />
        {image && (
          <div className="shareImageContainer">
            <img src={image} alt="" className="shareImg" />
            <Cancel
              className="shareCancelImage"
              onClick={() => setImage(null)}
            />
          </div>
        )}
        {props.isEdit && (
          <div className="shareImageContainer">
            <img src={props.post.img} alt="" className="shareImg" />
            {/* <Cancel
              className="shareCancelImage"
              onClick={() => setImage(null)}
            /> */}
          </div>
        )}
        <form
          className="shareBottom"
          onSubmit={props.isEdit ? editPostSubmitHandler : submitHandler}
        >
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="purple" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              {!props.isEdit && (
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={onChangeHandler}
                ></input>
              )}
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tags</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button type="submit" className="shareButton">
            {isFetching ? (
              <CircularProgress color="white" size="16px" />
            ) : props.isEdit ? (
              "Edit"
            ) : (
              "Share"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
