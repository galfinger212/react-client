import { useContext, useRef } from "react";
import "./login.css";
import { useHistory } from "react-router-dom";

import { loginCall } from "../apiCalls";
import { AuthContext } from "../context/AuthContext";
import { CircularProgress } from "@material-ui/core";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };
  const register = () => {
    history.push('register')
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Sela TalkBack</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Sela TalkBack.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton" onClick={register}>
              {isFetching ? (
                <CircularProgress color="white" size="20px" />
              ) : (
                "Create a New Account"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
// <Form>
    //   <Input ref={email}
    //     placeholder="Email"
    //     type="email"
    //     required="true"
    //     className="loginInput">
    //   </Input>
    //   <Input placeholder="Password"
    //     type="password"
    //     required="true"
    //     minLength="6"
    //     className="loginInput"
    //     ref={password}>
    //   </Input>
    //   <Btn i="sign-in" 
    //           className="loginButton"
    //           type="submit" 
    //           disabled={isFetching}>
    //     {isFetching ? (
    //       <CircularProgress color="white" size="20px" />
    //     ) : (
    //       "Log In"
    //     )}
    //   </Btn>
    // </Form>