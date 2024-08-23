import React ,{useEffect}from 'react';
import checkSession from './session';

function TopBar() {
  useEffect(() => {
    // Function to check the session status
    const checkUserSession = async () => {
      const isValid = await checkSession();
      if (isValid) {

      }else{
       // window.location.href = '/login'; // Redirect if session is valid
      }
    };
    checkUserSession(); // Run session check on component mount
  }, []); 
  return (
    <div style={styles.topBar}>
      <div style={styles.profileName}>Active Chat</div>
      <div style={styles.settingsIcon}>⚙️</div>
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#F7F3FA',
    borderBottom: '1px solid #e6e6e6',
  },
  profileName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4a4a4a',
  },
  settingsIcon: {
    cursor: 'pointer',
    fontSize: '18px',
  },
};

export default TopBar;
