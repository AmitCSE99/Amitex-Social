import React from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import SearchFriends from "../../components/searchFriends/SearchFriends";
import ShowFollowersFollowingContainer from "../../components/show-followers-following-container/show-followers-following-container";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import AuthContext from "../../context/AuthContext";
import classes from "./editPost.module.css";
import Share from "../../components/share/Share";
export default function EditPost() {
  const history = useHistory();
  const [isUserSearching, setIsUserSearching] = useState(false);
  const [usernameSearch, setUsernameSearch] = useState(null);
  console.log(history);

  const setSearch = () => {
    setIsUserSearching(true);
  };

  const stopSearch = () => {
    setIsUserSearching(false);
  };

  const setUserSearch = (name) => {
    setUsernameSearch(name);
  };
  const { id } = useParams();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const editedPostHandler = () => {
    setHasChanged(!hasChanged);
  };

  useEffect(() => {
    const fetchPost = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/posts/${id}`);
        setPost(response.data.post);
        console.log(response.data.post);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
      }
    };
    fetchPost();
  }, [id, hasChanged]);

  return (
    <>
      <Topbar
        setSearch={setSearch}
        stopSearch={stopSearch}
        setUserSearch={setUserSearch}
      ></Topbar>
      <div className={classes.outerContainer}>
        <Sidebar></Sidebar>
        <div className={classes.container}>
          {isFetching && (
            <div className={classes.circularProgress}>
              <CircularProgress />
            </div>
          )}
          {!isFetching && post && (
            <Share
              isEdit={true}
              post={post}
              editedPostHandler={editedPostHandler}
            />
          )}
        </div>
        <Rightbar></Rightbar>
      </div>
    </>
  );
}
