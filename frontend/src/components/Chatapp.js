import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatapp.css";

function Chatapp({ labsData, username1 }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeItem, setActiveItem] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Function to format the date and time
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString(undefined, options);
  };

  // Function to fetch messages from the backend API
  const fetchMessages = async (subject) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/fac/get_queryset/?subject=${subject}`
      );
      const formattedMessages = response.data.map((message) => ({
        ...message,
        time: formatDateTime(message.time),
        incoming: message.sender_id !== username1, // Set incoming based on sender_id
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    // Fetch initial messages for the default subject
    fetchMessages(activeItem);

    // Set up an interval to periodically fetch messages
    const interval = setInterval(() => {
      fetchMessages(activeItem);
    }, 5000); // Fetch messages every 5 seconds (adjust as needed)

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [activeItem]);

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  //Sending messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeItem) {
      const currentTime = formatDateTime(new Date());

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/fac/create_chat/",
          {
            subject: activeItem,
            sender_id: username1,
            message: newMessage,
          }
        );

        if (response.data.status === "success") {
          setMessages([
            ...messages,
            {
              ...response.data.data,
              time: currentTime,
              incoming: false,
            },
          ]);
          setNewMessage("");
        } else {
          console.error("Error sending message:", response.data.message);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    // Fetch messages for the selected subject
    fetchMessages(item);
  };

  return (
    <div className="ChatApp">
      <div className="ChatApp-container">
        <div className="ChatApp-sidebar">
          {labsData.map((lab, index) => (
            <div
              key={index}
              className={`ChatApp-sidebar-item ${
                activeItem === lab ? "active" : ""
              }`}
              style={{ backgroundColor: "#363949", color: "#f4f4f8" }}
              onClick={() => handleItemClick(lab)}
            >
              {lab}
            </div>
          ))}
        </div>
        <div className="ChatApp-chat-area">
          <div className="ChatApp-chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ChatApp-message ${
                  message.incoming ? "incoming" : "outgoing"
                }`}
                style={{
                  backgroundColor: message.incoming ? "#1565c0" : "#ababad",
                  color: "#363949",
                }}
              >
                <div className="ChatApp-message-text">{message.message}</div>
                <div className="ChatApp-message-time">{message.time}</div>
              </div>
            ))}
          </div>
          {activeItem && (
            <div className="ChatApp-chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={handleMessageChange}
                onKeyPress={handleKeyPress}
                style={{ backgroundColor: "#ababad", color: "#363949" }}
              />
              <button
                style={{ backgroundColor: "#1565c0", color: "#f4f4f8" }}
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatapp;
