import { createContext } from "react";
const AuthContext = createContext({
  user: null,
  isFetching: false,
  error: null,
  login: () => {},
  logout: () => {},
  followers: [],
  followings: [],
  requests: [],
  newNotifications: 0,
  setNewNotifications: () => {},
  Follow: () => {},
  Unfollow: () => {},
  RemoveRequest: () => {},
  StopFollowing: () => {},
});
export default AuthContext;
