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
  Follow: () => {},
  Unfollow: () => {},
  RemoveRequest: () => {},
});
export default AuthContext;
