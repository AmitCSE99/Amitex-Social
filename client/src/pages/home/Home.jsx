import React, { useState } from "react";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import SearchFriends from "../../components/searchFriends/SearchFriends";
import "./home.css";
export default function Home() {
  const [isSearching, setIsSearching] = useState(false);
  const [username, setUsername] = useState(null);

  const setSearch = () => {
    setIsSearching(true);
  };

  const stopSearch = () => {
    setIsSearching(false);
  };

  const setUserSearch = (name) => {
    setUsername(name);
  };

  return (
    <>
      <Topbar
        setSearch={setSearch}
        stopSearch={stopSearch}
        setUserSearch={setUserSearch}
      ></Topbar>
      <div className="topContainer">
        <Sidebar></Sidebar>
        {!isSearching && <Feed profile={false}></Feed>}
        {isSearching && <SearchFriends username={username} />}
        <Rightbar></Rightbar>
      </div>
    </>
  );
}
