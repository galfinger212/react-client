import "../ContactScreen/ContactScreen.css";
import 'emoji-mart/css/emoji-mart.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Picker } from 'emoji-mart'
import ChatOnline from "../../components/chatOnline/ChatOnline";
import ChatOffline from "../../components/chatOffline/chatOffline";
import Message from "../../components/message/Message";
import Backgammon from "../../components/Backgammon/Backgammon";
import User from "../../components/User/User";
import config from '../../config';
import Loader from "react-loader-spinner";

const Points = Array(24).fill({ player: false, checkers: 0 });

const ContactsScreen = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [emojiPicker, SetEmojiPicker] = useState(false);
    const [sendRequest, SetSendRequest] = useState(false);
    const [currentBoard, setCurrentBoard] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalGameRequest, setArrivalGameRequest] = useState(null);
    const [sendSeen, setSendSeen] = useState(null);
    const [typing, setTyping] = useState(null);
    const [approveGameRequest, setApproveGameRequest] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();
    const { user } = useContext(AuthContext);

    //set selected user from the child component - chatOnline
    const handleSelectedUser = (user) => {
        setSelectedUser(user);
    }

    //when the user click the backgammon button he send a request to the other player to play
    const StartGameClick = async () => {
        socket.current.emit("sendGameRequest", {
            senderId: user._id,
            receiverId: selectedUser._id
        });
        SetSendRequest(!sendRequest);
    }

    //open a conversation with the selected user
    const StartChatClick = async () => {
        await axios.get(config.url + `/conversations/find/${user._id}/${selectedUser._id}`).then((res) => {
            setCurrentChat(res.data);
        }).catch(async (err) => {
            if (err.response.status === 404) {
                await axios.post(config.url + `/conversations`, { senderId: user._id, receiverId: selectedUser._id }).then((newRes) => {
                    setCurrentChat(newRes.data);
                }).catch((err) => {
                    console.log(err);//problem with the server
                });
            }
        });
    }

    useEffect(() => {
        socket.current = io(config.socket);
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                messageId: data.messageId,
                createdAt: Date.now(),
            });
        });
        socket.current.on("getGameRequest", (data) => {
            setArrivalGameRequest({
                sender: data.senderId,
                currentBoard: data.currentBoard,
                createdAt: Date.now(),
            });
        });
        socket.current.on("approveGameRequest", (data) => {
            setApproveGameRequest({
                sender: data.senderId,
                currentBoard: data.currentBoard,
                createdAt: Date.now(),
            });
        });
        socket.current.on("getSeen", (data) => {
            setSendSeen({
                sender: data.senderId,
                conversation: data.conversation,
                createdAt: Date.now(),
            });
        });
        socket.current.on("getTyping", (data) => {
            setTyping({
                sender: data.senderId,
                typing: data.typing,
                createdAt: Date.now(),
            });
        });
        function drawBoard() {// draw a board and set points
            Points[0] = { player: "black", checkers: 2 };
            Points[11] = { player: "black", checkers: 5 };
            Points[16] = { player: "black", checkers: 3 };
            Points[18] = { player: "black", checkers: 5 };
            Points[23] = { player: "white", checkers: 2 };
            Points[12] = { player: "white", checkers: 5 };
            Points[7] = { player: "white", checkers: 3 };
            Points[5] = { player: "white", checkers: 5 };
        };
        drawBoard();
    }, []);

    //reset the current board 
    const ResetBackgammon = () => {
        setCurrentBoard(null);
    }
    //send respond to the user if approve the request to play together
    useEffect(() => {
        if (approveGameRequest != null) {
            if (approveGameRequest.currentBoard != null) {
                setCurrentBoard(approveGameRequest.currentBoard);
                setCurrentChat(null);
                setSelectedUser(null);
            }
            else {
                alert("its seems that he don't want to play with you...");
            }
            SetSendRequest(!sendRequest);
        }
    }, [approveGameRequest]);

    //pop up a message to the screen and ask the user for question, if not answer after the timeout the message will disappear
    function myConfirm(msg, timeout) {
        const inputs = [...document.querySelectorAll("input, textarea, select")].filter(input => !input.disabled);
        const modal = document.getElementById("modal");
        const elements = modal.children[0].children;
        function toggleModal(isModal) {
            for (const input of inputs) input.disabled = isModal;
            modal.style.display = isModal ? "block" : "none";
            elements[0].textContent = isModal ? msg : "";
        }
        return new Promise((resolve) => {
            toggleModal(true);
            elements[1].onclick = () => resolve(true);
            elements[2].onclick = () => resolve(false);
            setTimeout(resolve, timeout);
        }).then(result => {
            toggleModal(false);
            return result;
        });
    }

    //arrive request from user to play backgammon
    useEffect(() => {
        if (arrivalGameRequest != null) {
            async function refreshToken() {
                await axios.get(config.url + `/users/`, { params: { userId: arrivalGameRequest.sender } }).then((res) => {
                    var r = myConfirm(`You Have a new Game Request from ${res.data.username}...`, 5000);
                    return r.then(async ok => {
                        if (ok) {
                            await axios.post(config.url + `/board`, { senderId: user._id, receiverId: arrivalGameRequest.sender, currentBoard: Points }).then((newBoard) => {
                                setCurrentBoard(newBoard.data);
                                setCurrentChat(null);
                                setSelectedUser(null);
                                socket.current.emit("sendGameApproveRequest", {
                                    senderId: user._id,
                                    receiverId: arrivalGameRequest.sender,
                                    currentBoard: newBoard.data,
                                });
                            }).catch((err) => {
                                console.log(err);//problem with the server
                            });
                        } else {
                            socket.current.emit("sendGameApproveRequest", {
                                senderId: user._id,
                                receiverId: arrivalGameRequest.sender,
                                currentBoard: null,
                            });
                        }
                        return ok;
                    });
                }).catch((err) => {
                    console.log(err);//user not found
                });
            }
            refreshToken();
        }
    }, [arrivalGameRequest]);

    //user connected
    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
                users
            );
        });
    }, [user]);

    //new message arrive from one user
    useEffect(async () => {
        if (arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender)) {
            setMessages((prev) => [...prev, arrivalMessage]);
            await axios.put(config.url + "/messages/" + arrivalMessage.messageId).catch((err) => {
                console.log(err);//problem with the server
            });//update the message to seen (server)
            await axios.get(config.url + `/conversations/find/${user._id}/${arrivalMessage.sender}`).then((conversation) => {
                socket.current.emit("sendSeen", {//send to the user that sent the message that he saw the message right now
                    senderId: user._id,
                    receiverId: arrivalMessage.sender,
                    conversation: conversation.data,
                });
            }).catch((err) => {
                if (err.response.status === 404) {
                    console.log("conversation not found");
                }
                else {
                    console.log(err);//problem with the server
                }
            });
        }
    }, [arrivalMessage]);

    //the message that the current user send have been seen ' now need to update the current chat
    useEffect(async () => {
        if (sendSeen !== null && currentChat != null) {
            setCurrentChat(sendSeen.conversation);
        }
    }, [sendSeen]);

    //currentChat change
    useEffect(() => {
        if (currentChat) {
            const getMessages = async () => {
                try {//check the last messages and update the other user that he seen this messages
                    await axios.get(config.url + "/messages/" + currentChat?._id).then(async (res) => {
                        for (let index = res.data.length - 1; index >= 0; index--) {
                            const message = res.data[index];
                            if (message.sender !== user._id) {
                                if (message.seen === false) {
                                    //update message to seen
                                    await axios.put(config.url + "/messages/" + message._id).then(async (res) => {
                                        await axios.get(config.url + `/conversations/find/${res.data.updateModel.conversationId}`).then((conversation) => {
                                            socket.current.emit("sendSeen", {
                                                senderId: user._id,
                                                receiverId: message.sender,
                                                conversation: conversation.data,
                                            });
                                        }).catch((err) => {
                                            if (err.response.status === 404) {
                                                console.log("conversation not found");
                                            }
                                            else {
                                                console.log(err);//problem with the server
                                            }
                                        });
                                    }).catch((err) => {
                                        console.log(err);//problem with the server
                                    });
                                }
                                else {
                                    break;
                                }
                            }
                        }
                        setMessages(res.data);
                    }).catch((err) => {
                        console.log(err);//problem with the server
                    });
                } catch (err) {
                    console.log(err);
                }
            };
            getMessages();
        }
    }, [currentChat]);

    //update the other user if the current user typing
    useEffect(() => {
        if (currentChat) {
            const receiverId = currentChat.members.find(
                (member) => member !== user._id
            );
            if (newMessage.length === 0) {
                socket.current.emit("sendTyping", {
                    senderId: user._id,
                    receiverId: receiverId,
                    typing: false,
                });
            }
            if (newMessage.length > 0) {
                socket.current.emit("sendTyping", {
                    senderId: user._id,
                    receiverId: receiverId,
                    typing: true,
                });
            }
        }
    }, [newMessage]);

    //scrolling messages
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //send new message
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            seen: false,
            conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );
        try {
            await axios.post(config.url + "/messages", message).then((res) => {
                const messageId = res.data._id;
                socket.current.emit("sendMessage", {
                    senderId: user._id,
                    receiverId,
                    messageId: messageId,
                    text: newMessage,
                });
                setMessages([...messages, res.data]);
                setNewMessage("");
            }).catch((err) => {
                console.log(err);//problem with the server
            });
        } catch (err) {
            console.log(err);
        }
    };

    //add emoji to the input message
    const addEmoji = e => {
        let emoji = e.native;
        setNewMessage(newMessage + emoji)
    };

    //open and close Alternately all the emojis
    const triggerPicker = () => {
        SetEmojiPicker(!emojiPicker);
    }

    return (
        <>
            <div className="messenger">
                <div id="modal">
                    <div>
                        <div></div>
                        <button>OK</button>
                        <button>Cancel</button>
                    </div>
                </div>
                <div className="leftList">
                    <div className="topName">
                        <div className="username">
                            <div>Hello</div>
                            <span>{user?.username}</span>
                        </div>
                        <div>
                            <button className="Button" onClick={StartChatClick} disabled={selectedUser === null ? true : false}>
                                <img className="Button" src={process.env.PUBLIC_URL + "images/chatbtn.png"}></img>
                            </button>
                            <button onClick={StartGameClick} disabled={selectedUser === null || sendRequest ? true : false}>
                                {sendRequest === false ? <img className="Button" src={process.env.PUBLIC_URL + "images/backgammon.png"}></img>
                                    : <Loader
                                        type="Rings"
                                        color="#00BFFF"
                                        height={80}
                                        width={80}
                                        timeout={5000} //5 secs
                                    />}
                            </button>
                        </div>
                    </div>
                    {onlineUsers.length !== 0 ?
                        <div >
                            <div className="chatOnlineWrapper">
                                <ChatOnline
                                    initSelectedUser={selectedUser}
                                    onlineUsers={onlineUsers}
                                    currentId={user._id}
                                    onSelectedUser={handleSelectedUser}
                                />
                                <ChatOffline
                                    onlineUsers={onlineUsers}
                                    currentId={user._id}
                                />
                            </div>
                        </div> : <div className="connect">
                            Find Online Users...
                        </div>
                    }
                </div>
                <div >
                    {currentBoard ? (<>
                        <Backgammon EndGame={ResetBackgammon} initSocket={socket.current} userPlayId={user._id} currentBoard={currentBoard} propsBoard={Points}></Backgammon>
                    </>) : ""}
                </div>
                {currentChat ? (
                    <div className="chat">
                        <div className="chat-container">
                            <User typing={typing && currentChat.members.find((member) => member !== user._id) === typing.sender ? typing.typing : false}
                                sender={user} userId={selectedUser._id}></User>
                            <div className="conversation">
                                <div className="conversation-container">
                                    <>
                                        {messages.map((m, index) => (
                                            <Message key={index} seen={m.seen} ref={scrollRef} message={m} own={m.sender === user._id} />
                                        ))}
                                    </>
                                    {emojiPicker ? <div className="emojiPickerDiv" ><Picker emoji="grinning" title="Choose color" onSelect={addEmoji} /></div> : ""}
                                </div>
                                <div className="conversation-compose">
                                    <div className="emoji">
                                        <svg className="emojiPicker" onClick={triggerPicker} xmlns="http://www.w3.org/2000/svg" width="24" height="24" id="smiley" x="3147" y="3209"><path fillRule="evenodd" clipRule="evenodd" d="M9.153 11.603c.795 0 1.44-.88 1.44-1.962s-.645-1.96-1.44-1.96c-.795 0-1.44.88-1.44 1.96s.645 1.965 1.44 1.965zM5.95 12.965c-.027-.307-.132 5.218 6.062 5.55 6.066-.25 6.066-5.55 6.066-5.55-6.078 1.416-12.13 0-12.13 0zm11.362 1.108s-.67 1.96-5.05 1.96c-3.506 0-5.39-1.165-5.608-1.96 0 0 5.912 1.055 10.658 0zM11.804 1.01C5.61 1.01.978 6.034.978 12.23s4.826 10.76 11.02 10.76S23.02 18.424 23.02 12.23c0-6.197-5.02-11.22-11.216-11.22zM12 21.355c-5.273 0-9.38-3.886-9.38-9.16 0-5.272 3.94-9.547 9.214-9.547a9.548 9.548 0 0 1 9.548 9.548c0 5.272-4.11 9.16-9.382 9.16zm3.108-9.75c.795 0 1.44-.88 1.44-1.963s-.645-1.96-1.44-1.96c-.795 0-1.44.878-1.44 1.96s.645 1.963 1.44 1.963z" fill="#7d8489" /></svg>
                                    </div>
                                    <input className="input-msg"
                                        id="inputMessage"
                                        name="input"
                                        placeholder="Type a message"
                                        autoComplete="off"
                                        autoFocus
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}></input>
                                    <div className="photo">
                                        <i className="zmdi zmdi-camera"></i>
                                    </div>
                                    <button className="send" onClick={handleSubmit}>
                                        <div className="circle">Send</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ""}
            </div>
        </>
    )
}

export default ContactsScreen;