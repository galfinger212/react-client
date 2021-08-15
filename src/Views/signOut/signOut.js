import "./signOut.css";
import { useRef, useContext, useEffect } from 'react';
import { logoutCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";

const SignOut = ({ initHistory }) => {
    const history = useRef(initHistory);
    const currentRout = useRef("/");
    const { dispatch } = useContext(AuthContext);

    useEffect(() => {
        var answer = window.confirm("Are you sure you want to logOut?")
        if (answer) {
            logoutCall(dispatch);
        }
        else {
            history.current.push("/");
            currentRout.current = "/";
        }
    }, []);
    return (
        <div>

        </div>
    )
}

export default SignOut;