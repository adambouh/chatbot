import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';


function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const [chats, setChats] = useState([]);
  const location = useLocation();

  const userId = localStorage.getItem('id');

  // Fetch chats from API
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8081/chat/${userId}/`)
        .then(response => response.json())
        .then(data => setChats(data))
        .catch(error => console.error('Error fetching chats:', error));
    }
  }, [userId]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      style={{
        ...styles.sidebar,
        width: expanded ? '200px' : '80px',
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div style={{ ...styles.sidebarTitle, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#7D6F9B" strokeWidth="5" fill="#F7F3FA"/>
          <path d="M30 50L50 30L70 50L50 70L30 50Z" fill="#7D6F9B"/>
          <path d="M50 30L70 50L50 70L30 50L50 30Z" stroke="#F7F3FA" strokeWidth="5"/>
        </svg>
        {expanded && <span>Chats</span>}
      </div>
      <div style={styles.menuItemContainer}>
        <Link
        to={'/'}
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >   

        <div
          style={{
            ...styles.sidebarButton,
            width: expanded ? '150px' : '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" fill="none" stroke="#9f606c" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {expanded && <span style={{ ...styles.menuItemText, color: "#9f606c" }}>New Chat</span>}
        </div>       
      </Link>

      {chats.map(chat => {
          const isActive = location.pathname === `/chats/${chat.id}`;
          return (
            <Link
              to={`/chats/${chat.id}`}
              key={chat.id}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                ...styles.menuItem,
                ...(isActive ? styles.activeMenuItem : {}),
                width: expanded ? '150px' : '50px'
              }}>
                <div style={styles.menuItemContent}>
                  <svg width="24" height="24" fill="none" stroke={isActive ? "#ffffff" : "#7D6F9B"} strokeWidth="2">
                    <path d="M21 15C21 16.1046 20.1046 17 19 17H6.83L3 20.83V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" />
                  </svg>
                  {expanded && <span style={{ ...styles.menuItemText, color: isActive ? "#ffffff" : "#7D6F9B" }}>{chat.name}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    backgroundColor: '#F7F3FA',
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    transition: 'width 0.3s',
    position: 'relative',
    overflow:'overlay'
  },
  sidebarButton: {
    backgroundColor: '#FFE5EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '25px',
    cursor: 'pointer',
    height: '50px',
    transition: 'background-color 0.3s, box-shadow 0.3s, width 0.3s',
    position: 'relative',
    overflow: 'hidden',
  },
  sidebarTitle: {
    fontSize: '18px',
    color: '#7D6F9B',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  menuItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    gap: '20px',
    alignItems: 'center',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '25px',
    cursor: 'pointer',
    height: '50px',
    backgroundColor: '#EAE4EF',
    transition: 'background-color 0.3s, box-shadow 0.3s, width 0.3s',
    position: 'relative',
    overflow: 'hidden',
  },
  activeMenuItem: {
    backgroundColor: '#7D6F9B',
    color: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  menuItemContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  menuItemText: {
    fontSize: '14px',
    color: '#ffffff',
    whiteSpace: 'nowrap',
  },
};

export default Sidebar;