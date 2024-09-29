import React from 'react';
import TopBar from './topbar';
import Sidebar from './Sidebar';
import ChatBubble from './ChatBubble';
import Chat from './chat';

function Home() {
  
  return (
    <div style={styles.chatContainer}>
      <Sidebar />
      <div style={styles.chatSection}>
        <TopBar />
        <div style={styles.chatMessages}>
          <Chat userId=""  chatId="" />
                </div>
        <div style={styles.chatInput}>
          <input type="text" placeholder="Type your message here..." style={styles.input} />
          <button style={styles.sendButton}>Send</button>
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

export default Home;
