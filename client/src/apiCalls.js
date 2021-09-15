import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const response = await axios.post("auth/login", userCredential);
    console.log(response.data);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem(
      "userdata",
      JSON.stringify(response.data.user_payload)
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user_payload });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};
