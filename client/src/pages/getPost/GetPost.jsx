import React from "react";
import { CircularProgress } from "@material-ui/core";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import SearchFriends from "../../components/searchFriends/SearchFriends";
import ShowFollowersFollowingContainer from "../../components/show-followers-following-container/show-followers-following-container";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import AuthContext from "../../context/AuthContext";
import Post from "../../components/post/Post";
import classes from "./getPost.module.css";
export default function GetPost() {
  const [isUserSearching, setIsUserSearching] = useState(false);
  const [usernameSearch, setUsernameSearch] = useState(null);
  const [post, setPost] = useState(null);
  const { id } = useParams();
  console.log(id);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const setSearch = () => {
    setIsUserSearching(true);
  };

  const stopSearch = () => {
    setIsUserSearching(false);
  };

  const setUserSearch = (name) => {
    setUsernameSearch(name);
  };
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`/posts/${id}`);
        console.log(response.data.post);
        setPost(response.data.post);
        console.log(post);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Topbar
        setSearch={setSearch}
        stopSearch={stopSearch}
        setUserSearch={setUserSearch}
      ></Topbar>
      <div className={classes.postContainer}>
        <Sidebar></Sidebar>
        {!isUserSearching && (
          <div className={classes.post}>
            {isFetching && (
              <div className={classes.circularProgress}>
                <CircularProgress />
              </div>
            )}
            {!isFetching && post && <Post post={post}></Post>}
          </div>
        )}
        {isUserSearching && <SearchFriends username={usernameSearch} />}
        <Rightbar></Rightbar>
      </div>
    </>
  );
}
