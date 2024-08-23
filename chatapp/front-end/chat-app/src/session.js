import backendUrl from './url';
import token from './token';

async function checkSession() {
    if (!token) {
      return false;
    }else{
    }
  
    try {
      const response = await fetch(backendUrl + '/user/session/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (response.ok) {
        return true;
      } else {
        localStorage.removeItem('token');
        return false;
      }
    } catch (error) {
      console.error('Error checking session:', error);
      localStorage.removeItem('token');
      return false;
    }
  }
  
  export default checkSession;
  