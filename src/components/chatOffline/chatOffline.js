import axios from "axios";
import { useEffect, useState } from "react";
import "../chatOffline/chatOffline.css";
import config from '../../config';

const ChatOffline = ({ onlineUsers, currentId }) => {
  const [users, setUsers] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  async function getUsers() {
    await axios.get(config.url + "/users/allUsers").then((res) => {
      let array = [];
      for (let index = 0; index < res.data.length; index++) {
        const user = res.data[index];
        const onUser = onlineUsers.find(u => u.userId === user._id);
        if (!onUser && user._id !== currentId) {
          array.push(user);
        }
      }
      setUsers(array);
    }).catch((err) => {
      console.log(err);//problem with the server
    });
  }

  useEffect(async () => {
    getUsers();
  }, [currentId]);

  useEffect(async () => {
    if (onlineUsers.length !== 0) {
      getUsers();
    }
  }, [onlineUsers]);

  return (
    <>
      <div className="chatOffline">
        <div className="textOffline">
          Offline Users
        </div>
        {users.map((o) => (
          <div key={o?._id} className="chatOfflineFriend">
            <div className="chatOfflineImgContainer">
              <img
                className="chatOfflineImg"
                src={
                  o?.profilePicture
                    ? PF + o.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt="" />
              <div className="chatOfflineBadgeGrey"></div>
            </div>
            <span className="chatOfflineName">{o?.username}</span>
          </div>
        ))}
      </div>
    </>
  );
}
export default ChatOffline