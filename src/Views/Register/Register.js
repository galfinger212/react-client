import axios from "axios";
import { useRef } from "react";
import "./Register.css";
import { useHistory } from "react-router";

const LoginForm = () => {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory();

    const handleClick = async (e) => {
        console.log("here");
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try {
                await axios.post("/auth/register", user).then((res) => {
                    history.push("/login");
                });
            } catch (err) {
                console.log(err);
                switch (err.response.status) {
                    case 409:
                        alert(err.response.data)
                        break;
                    case 500:
                        console.log(err);//problem with the server
                        break;
                    default:
                        break;
                }
            }
        }
    };
    const login = () => {
        history.push('login')
    };

    return (
        <form id="loginform" onSubmit={handleClick}>
            <h2 id="headerTitle">Registration Page</h2>
            <div className="row">
                <label>Username</label>
                <input
                    placeholder="Username"
                    required
                    ref={username} />
            </div>
            <div className="row">
                <label>Email</label>
                <input
                    placeholder="Email"
                    required
                    ref={email}
                    type="email" />
            </div>
            <div className="row">
                <label>Password</label>
                <input
                    placeholder="Password"
                    required
                    ref={password}
                    type="password"
                    minLength="6" />
            </div>
            <div className="row">
                <label>Password Again</label>
                <input
                    placeholder="Password Again"
                    required
                    ref={passwordAgain}
                    type="password" />
            </div>
            <div id="button" className="row">
                <button type="submit">
                    Sign Up
                </button>
            </div>
            <div id="button" className="row">
                <button className="loginRegisterButton" onClick={login}>
                    Log into Account
                </button>
            </div>
        </form>
    )
};

export default LoginForm;