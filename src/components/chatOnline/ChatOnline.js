import axios from "axios";
import { useEffect, useState } from "react";
import "../chatOnline/chatOnline.css";

const ChatOnline = ({ onlineUsers, currentId, onSelectedUser, initSelectedUser }) => {
  const [online, setOnline] = useState([]);
  const [selectedUser, setSelectedUser] = useState(initSelectedUser);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(async () => {
    getOnlineUsers();
  }, [currentId]);

  //get all the users from the server and then return only the online users!
  async function getOnlineUsers() {
    await axios.get("/users/allUsers").then((res) => {
      let array = [];
      for (let index = 0; index < onlineUsers.length; index++) {
        const user = onlineUsers[index];
        const onUser = res.data.find(u => u._id === user.userId && user.userId !== currentId);
        if (onUser) {
          array.push(onUser);
        }
      }
      setOnline(array);
    }).catch((err) => {
      console.log(err);//problem with the server
    });
  }

  //when the socket online users array chang, we update the online array
  useEffect(async () => {
    if (onlineUsers.length !== 0) {
      getOnlineUsers();
    }
  }, [onlineUsers]);

  //change the background color of the online user that selected
  const handleClick = async (user) => {
    var optionElement
    if (selectedUser != null) {
      optionElement = document.getElementById(selectedUser._id);
      optionElement.style.background = 'none';
    }
    optionElement = document.getElementById(user._id);
    optionElement.style.background = 'limegreen';
    setSelectedUser(user);
    onSelectedUser(user);//update the selected user to the parent component - contactScreen
  };

  return (
    <>
      <div className="chatOnline">
        <div className="textOnline">
          {online.length > 0 ? "Online Users" : "No Online Users Right Now"}
        </div>
        {online.map((o) => (
          <div id={o?._id} key={o?._id} className="chatOnlineFriend" onClick={() => handleClick(o)}>
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src={
                  o?.profilePicture
                    ? PF + o.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt="" />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o?.username}</span>
          </div>
        ))}
      </div>
    </>
  );
}
export default ChatOnline