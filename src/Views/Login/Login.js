import { useContext, useRef } from "react";
import "./Login.css";
import { useHistory } from "react-router-dom";

import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
//import { CircularProgress } from "@material-ui/core";




const LoginForm = () => {
    const username = useRef();
    const password = useRef();
    const { isFetching, dispatch } = useContext(AuthContext);
    const history = useHistory();

    const handleClick = (e) => {
        e.preventDefault();
        loginCall(
            { username: username.current.value, password: password.current.value },
            dispatch
        );

    };
    const register = () => {
        history.push('register')
    };

    return (
        <form id="loginform" onSubmit={handleClick}>
            <h2 id="headerTitle">Login Page</h2>
            <div className="row">
                <label>UserName</label>
                <input
                    placeholder="Username"
                    type="text"
                    required
                    ref={username}
                />
            </div>
            <div className="row">
                <label>Password</label>
                <input
                    placeholder="Password"
                    type="password"
                    required
                    minLength="6"
                    ref={password} />
            </div>
            <div id="button" className="row">
                <button type="submit" disabled={isFetching}>
                    Log In
                </button>

            </div>
            <div className="ForgotPassword ">
                Forgot Password / Not a member ?
            </div>
            <div id="button" className="row">
                <button className="loginRegisterButton" onClick={register}>
                    Create a New Account
                </button>
            </div>

        </form>
    )

};

export default LoginForm;