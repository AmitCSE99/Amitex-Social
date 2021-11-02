import { createContext } from "react";
const AuthContext = createContext({
  user: null,
  isFetching: false,
  error: null,
  socket: null,
  socketNotifications: 0,
  setSocketNotifications: () => {},
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
  AddRequests: () => {},
});
export default AuthContext;
