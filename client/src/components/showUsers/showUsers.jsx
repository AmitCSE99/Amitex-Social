import "./showUsers.css";
import { useHistory } from "react-router-dom";
export default function ShowUsers(props) {
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const goToUserProfileHandler = () => {
    history.push(`/profile/${props.username}`);
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
      </div>
    </div>
  );
}
