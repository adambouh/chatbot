import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from './topbar';
import Sidebar from './Sidebar';
import ChatBubble from './ChatBubble'; // Assuming you have a ChatBubble component
import token from './token'; // Assuming you have a token utility for JWT
import backendUrl from './url';

function Chats() {
  const { Id } = useParams(); // Extract 'id' from route parameters

  const user = {
    id: localStorage.getItem('id'),
    username: localStorage.getItem('username')
  };

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);

  // Ref to scroll to the bottom of the chat
  const chatMessagesEndRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`${backendUrl}/chat/${user.id}/${Id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Add the JWT token in the Authorization header
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch chat messages');
        }

        const data = await response.json();
        const chatMessages = data.messages || [];

        setMessages(chatMessages.map(msg => ({
          message: msg.content,
          isSender: msg.sender === user.id,
        })));
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatMessages();
  }, [user.id, Id]); // Dependencies for the useEffect hook

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom when messages change

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const message = {
      content: inputText,
      sender: user.id,
    };

    fetch(`${backendUrl}/message/${user.id}/${Id}/add`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          setMessages(prevMessages => [
            ...prevMessages,
            { message: inputText, isSender: true }, // Add sent message to UI
            { message: data.content, isSender: false } // Simulate system response
          ]);
          setInputText(''); // Clear input field after sending
        } else {
          console.error('Failed to send message');
        }
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  // Function to handle Enter key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div style={styles.chatContainer}>
      <Sidebar />
      <div style={styles.chatSection}>
        <TopBar />
        <div style={styles.chatMessages}>
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg.message} isSender={msg.isSender} />
          ))}
          {/* This div is for scrolling to the bottom */}
          <div ref={chatMessagesEndRef} />
        </div>
        <div style={styles.chatInput}>
          <input
            type="text"
            placeholder="Type your message here..."
            style={styles.input}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key press
          />
          <button style={styles.sendButton} onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '20px',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  chatSection: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '0 20px 20px 0',
    overflow: 'hidden',
  },
  chatMessages: {
    flexGrow: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  chatInput: {
    padding: '15px',
    borderTop: '1px solid #e6e6e6',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#F7F3FA',
  },
  input: {
    flexGrow: 1,
    padding: '10px 15px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: '#fff',
    outline: 'none',
  },
  sendButton: {
    background: '#7D6F9B',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Chats;
