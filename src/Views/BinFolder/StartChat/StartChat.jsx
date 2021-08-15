import axios from "axios";
import { useEffect, useState, useRef, useContext } from "react";
import "./StartChat.css";
import { io } from "socket.io-client";
import Message from "../message/Message";
import { AuthContext } from "../../context/AuthContext";


const StartChat = ({ conversation }) => {
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const socket = useRef();
    const scrollRef = useRef();
    const { user } = useContext(AuthContext);



    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
        setCurrentChat(conversation);
    }, []);

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/messages/" + currentChat?._id);
                setMessages(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };

        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );
        console.log(receiverId);
        console.log(user._id);
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text: newMessage,
        });

        try {
            const res = await axios.post("/messages", message);
            setMessages([...messages, res.data]);
            setNewMessage("");
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>

            <div className="chatBox">
                <div className="chatBoxWrapper">
                    <div className="chatBoxTop">
                        {messages.map((m) => (
                            <div key={m._id} ref={scrollRef}>
                                <Message message={m} own={m.sender === user._id} />
                            </div>
                        ))}
                    </div>
                    <div className="chatBoxBottom">
                        <textarea
                            className="chatMessageInput"
                            placeholder="write something..."
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage}
                        ></textarea>
                        <button className="chatSubmitButton" onClick={handleSubmit}>
                            Send
                        </button>
                    </div>
                </div>
            </div>
            {/* <div className="container">
                <div className="mesgs">
                    <div className="msg_history">
                        <div className="incoming_msg">
                            <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                            <div className="received_msg">
                                <div className="received_withd_msg">
                                    <p>Test which is a new approach to have all
                                        solutions</p>
                                    <span className="time_date"> 11:01 AM    |    June 9</span></div>
                            </div>
                        </div>
                        <div className="outgoing_msg">
                            <div className="sent_msg">
                                <p>Test which is a new approach to have all
                                    solutions</p>
                                <span className="time_date"> 11:01 AM    |    June 9</span> </div>
                        </div>
                        <div className="incoming_msg">
                            <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                            <div className="received_msg">
                                <div className="received_withd_msg">
                                    <p>Test, which is a new approach to have</p>
                                    <span className="time_date"> 11:01 AM    |    Yesterday</span></div>
                            </div>
                        </div>
                        <div className="outgoing_msg">
                            <div className="sent_msg">
                                <p>Apollo University, Delhi, India Test</p>
                                <span className="time_date"> 11:01 AM    |    Today</span> </div>
                        </div>
                        <div className="incoming_msg">
                            <div className="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                            <div className="received_msg">
                                <div className="received_withd_msg">
                                    <p>We work directly with our designers and suppliers,
                                        and sell direct to you, which means quality, exclusive
                                        products, at a price anyone can afford.</p>
                                    <span className="time_date"> 11:01 AM    |    Today</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="type_msg">
                        <div className="input_msg_write">
                            <input type="text" className="write_msg" placeholder="Type a message" />
                            <button className="msg_send_btn" type="button"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
            </div> */}


        </>
    );
}
export default StartChat