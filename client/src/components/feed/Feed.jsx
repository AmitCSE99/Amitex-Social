import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

export default function Feed({ profile, username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  console.log(username);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = username
        ? await axios.get(
            `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/posts/profile/${username}`,
            {
              params: {
                token: localStorage.getItem("accessToken"),
              },
            }
          )
        : await axios.get(
            `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/posts/timeline/` +
              user._id
          );

      if (!response.data.success) {
        console.log("access token refresh hobe");
        const newResponse = await axios.post(
          `${process.env.REACT_APP_AMITEX_SOCIAL_BACKEND}/auth/token`,
          {
            refreshToken: localStorage.getItem("refreshToken"),
          }
        );
        localStorage.setItem("accessToken", newResponse.data.accessToken);
        localStorage.setItem("userdata", JSON.stringify(newResponse.data.user));
        window.location.reload();
      }
      setPosts(
        response.data.posts.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
      console.log(response);
    };
    fetchPosts();
  }, [username, user._id]);

  return (
    <div className={profile ? "feedProfile" : "feed"}>
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share></Share>}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
