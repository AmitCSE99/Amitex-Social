import "./closeFriends.css";

export default function CloseFriends({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <img
        src={
          user.profilePicture ? user.profilePicture : PF + "person/noAvatar.png"
        }
        alt=""
        className="sidebarFriendImage"
      />
      <span className="sidebarFriendName">{user.name}</span>
    </li>
  );
}
