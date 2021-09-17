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
export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
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
      desc: desc.current.value,
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
      await axios.post("/posts", newPost);
      setIsFetching(false);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

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
            ref={desc}
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
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="purple" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={onChangeHandler}
              ></input>
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
            ) : (
              "Share"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
