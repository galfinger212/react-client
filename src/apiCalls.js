import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post("/auth/login", userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    window.location.reload();
  } catch (err) {
    switch (err.response.status) {
      case 400:
        alert(err.response.data.message)
        break;
      case 404:
        alert(err.response.data.message)
        break;
      default:
        alert(err)//problem with the server
        break;
    }
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

export const logoutCall = async (dispatch) => {
  dispatch({ type: "LOGOUT" });
  window.location.reload();
};


