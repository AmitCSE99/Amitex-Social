import Rightbar from "../../components/rightbar/Rightbar";
import ShowUsers from "../../components/showUsers/showUsers";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import "./findUsers.css";
import { useEffect, useState } from "react";
import axios from "axios";
export default function FindUsers() {
  const name = useParams().name;
  const [usersList, setUsersList] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  console.log(name);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsFetching(true);
        const response = await axios.get(`/user/findUsers/${name}`);
        setUsersList(response.data.users);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    fetchUsers();
  }, [name]);
  return (
    <>
      <Topbar />
      <div className="findUsersContainer">
        <Sidebar></Sidebar>
        <div className="findUsersSection">
          <p className="findUsersHeading">Search Results</p>
          <div className="findUsersFeed">
            <div
              className={
                isFetching ? "fetchUsersListLoading" : "fetchUsersList"
              }
            >
              {/* <ShowUsers></ShowUsers>
              <ShowUsers></ShowUsers>
              <ShowUsers></ShowUsers> */}
              {!isFetching && usersList && usersList.length === 0 && (
                <div className="noUserFound">
                  <p>No user found!</p>
                </div>
              )}
              {isFetching && <CircularProgress />}
              {!isFetching &&
                usersList &&
                usersList.map((u) => (
                  <ShowUsers name={u.name} username={u.username}></ShowUsers>
                ))}
            </div>
          </div>
        </div>
        <Rightbar />
      </div>
    </>
  );
}
