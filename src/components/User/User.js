import './User.css';
import { useEffect, useState } from "react";
import axios from "axios";
import config from '../../config';

const User = ({ userId, sender, typing }) => {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [name, setName] = useState(null);

    useEffect(async () => {
        await axios.get(config.url + `/users/`, { params: { userId: userId } }).then((res) => {
            setName(res.data.username)
        }).catch((err) => {
            console.log(err);//user not found
        });
    }, []);
    return (
        <div data-testid="user-bar" className="user-bar">
            <div data-testid="avatar" className="avatar">
                <img
                    src={
                        sender?.profilePicture
                            ? PF + sender.profilePicture
                            : PF + "person/noAvatar.png"
                    }
                    alt=""
                />
            </div>
            <div data-testid="username" className="name">
                <span data-testid="spanUserName">
                    {name}
                </span>
                {typing ? <span data-testid="typingSpan" className="status">typing...</span> : ""}
            </div>
        </div>
    )
}

export default User;