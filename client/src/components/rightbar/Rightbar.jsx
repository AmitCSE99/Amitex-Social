import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
export default function Rightbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        <div className="birthdayContainer">
          <img className="birthdayImage" src={`${PF}gift.png`} alt="" />
          <span className="birthdayText">
            <b>Amitendu</b> and <b>3 other friends</b> have a birthday today
          </span>
        </div>
        <img className="rightbarAd" src="/assets/ad2.jpg" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u}></Online>
          ))}
        </ul>
      </div>
    </div>
  );
}
