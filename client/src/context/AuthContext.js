// import { createContext, useEffect, useReducer } from "react";
// import AuthReducer from "./AuthReducer";
// const userdata = JSON.parse(localStorage.getItem("userdata"));
// const INITIAL_STATE = {
//   user: userdata ? userdata : null,
//   isFetching: false,
//   error: false,
// };
// export const AuthContext = createContext(INITIAL_STATE);
// export const AuthContextProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
//   return (
//     <AuthContext.Provider
//       value={{
//         user: state.user,
//         isFetching: state.isFetching,
//         error: state.error,
//         dispatch,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext } from "react";
const AuthContext = createContext({
  user: null,
  isFetching: false,
  error: null,
  login: () => {},
  logout: () => {},
  followers: [],
  followings: [],
  Follow: () => {},
  Unfollow: () => {},
});
export default AuthContext;
