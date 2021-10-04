import "./showUsers.css";
import { useHistory } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
export default function ShowUsers(props) {
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user, followers, requests, Follow, RemoveRequest } =
    useContext(AuthContext);
  const [taskComplete, setTaskComplete] = useState(false);
  const [taskType, setTaskType] = useState(-1);

  const goToUserProfileHandler = () => {
    history.push(`/profile/${props.username}`);
  };

  const acceptUserRequestHandler = async () => {
    try {
      await axios.put("/user/" + props.id + "/acceptRequest", {
        userId: user._id,
      });
      const newFollowersList = [...followers, props.id];
      const newRequestList = requests.filter(
        (uid) => uid.toString() !== props.id.toString()
      );
      Follow(newFollowersList, newRequestList);
      setTaskType(0);
      setTaskComplete(true);
    } catch (err) {
      console.log(err);
    }
  };
  const rejectUserRequestHandler = async () => {
    try {
      await axios.put("/user/" + props.id + "/rejectRequest", {
        userId: user._id,
      });
      const newRequestList = requests.filter(
        (uid) => uid.toString() !== props.id.toString()
      );
      RemoveRequest(newRequestList);
      setTaskType(1);
      setTaskComplete(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="userContainer">
      <div className="user">
        <img
          className="userImage"
          src={PF + "person/noAvatar.png"}
          onClick={goToUserProfileHandler}
        ></img>
        <div className="userDetailsContainer">
          <p className="userDetailsName" onClick={goToUserProfileHandler}>
            {props.name}
          </p>
          <p className="userDetailsUsername" onClick={goToUserProfileHandler}>
            @{props.username}
          </p>
        </div>
        {props.isRequest && !taskComplete && (
          <div className="requestButtonContainer">
            <button
              className="requestAcceptButton"
              onClick={acceptUserRequestHandler}
            >
              Accept
            </button>
            <button
              className="requestRejectButton"
              onClick={rejectUserRequestHandler}
            >
              Reject
            </button>
          </div>
        )}
        {taskComplete && (
          <div className="requestButtonContainer">
            <button className="disabledButton" disabled={true}>
              {taskType === 0 && "Accepted"}
              {taskType == 1 && "Rejected"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
