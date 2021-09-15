import "./show-followers-following-container.css";
import { useHistory } from "react-router-dom";

const ShowFollowersFollowingContainer = (props) => {
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const goToUserProfileHandler = () => {
    history.push(`/profile/${props.follower.username}`);
  };
  return (
    <div className="followerContainer">
      <div className="follower">
        <img
          className="followerImage"
          src={PF + "person/noAvatar.png"}
          onClick={goToUserProfileHandler}
        ></img>
        <p className="followerName" onClick={goToUserProfileHandler}>
          {props.follower.name}
        </p>
      </div>
    </div>
  );
};
export default ShowFollowersFollowingContainer;
