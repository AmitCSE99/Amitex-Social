import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useContext, useRef } from "react";
import AuthContext from "../../context/AuthContext";
export default function Topbar(props) {
  const { user, logout, requests } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const searchRef = useRef();
  const history = useHistory();
  const logoutHandler = () => {
    history.replace("/");
    logout();
  };
  const nameSearchHandler = (e) => {
    // e.preventDefault();
    const searchInput = searchRef.current.value;
    console.log(searchInput);
    // history.push(`/findUsers/${searchInput}`);
    if (searchInput.length === 0) props.stopSearch();
    else {
      props.setSearch();
      props.setUserSearch(searchInput);
    }
  };

  const nameSubmitHandler = (e) => {
    e.preventDefault();
    const searchInput = searchRef.current.value;
    history.push(`/findUsers/${searchInput}`);
  };

  const goToFriendRequestsPageHandler = () => {
    history.push("/friendRequests");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Amitex Social</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <form
          className="searchbar"
          onChange={nameSearchHandler}
          onSubmit={nameSubmitHandler}
        >
          <Search className="searchIcon"></Search>
          <input
            placeholder="Search for any friends, post or video"
            className="searchInput"
            ref={searchRef}
          />
        </form>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink" onClick={logoutHandler}>
            Logout
          </span>
        </div>
        <div className="topbarIcons">
          <div
            className="topbarIconItem"
            onClick={goToFriendRequestsPageHandler}
          >
            <Person />
            {requests && (
              <span className="topbarIconBadge">{requests.length}</span>
            )}
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImage"
          />
        </Link>
      </div>
    </div>
  );
}
