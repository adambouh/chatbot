import React, { useEffect, useState } from 'react';
import ChatBubble from './ChatBubble';
import token from './token';

function Chat({ userId, chatId }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Fetch chat messages when component mounts
        fetch(`http://localhost:8081/chat/${userId}/${chatId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Add the JWT token in the Authorization header
                'Content-Type': 'application/json' // Ensure the Content-Type is set if needed
            }
        })
            .then(response => response.json())
            .then(data => {
                // Extract messages from the data
                const chatMessages = data.messages || []; // Ensure messages is an array
                setMessages(chatMessages.map(msg => ({
                    message: msg.content,
                    isSender: msg.sender === userId, // Determine if the message is from the current user
                })));
            })
            .catch(error => {
                console.error('Error fetching chat data:', error);
            });
    }, [userId, chatId]);
    return (
        <div style={{ padding: '20px' }}>
            {messages.map((msg, index) => (
                <ChatBubble key={index} message={msg.message} isSender={msg.isSender} />
            ))}
        </div>
    );
}

export default Chat;
