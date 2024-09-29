import React from 'react';

function ChatBubble({ message, isSender }) {
  return (
    <div style={{ ...styles.bubbleContainer, ...(isSender ? styles.sender : styles.receiver) }}>
      <div style={styles.bubble}>
        {message}
      </div>
    </div>
  );
}

const styles = {
  bubbleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '10px',
  },
  sender: {
    justifyContent: 'flex-end',
  },
  receiver: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '30%', // Smaller width for a more compact bubble
    padding: '8px 12px', // Reduced padding for smaller bubbles
    borderRadius: '15px',
    fontSize: '14px', // Smaller font size
    lineHeight: '1.4', // Adjusted line height
    backgroundColor: '#EAE4EF',
    color: '#333',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word', // Ensures text breaks to fit within the bubble
    overflowWrap: 'break-word', // Handles long words like URLs 
  },
};

export default ChatBubble;
