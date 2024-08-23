import backendUrl from './url';

async function logout() {
    try {
        const response = await fetch(backendUrl+'/user/logout', {
            method: 'POST',
            credentials: 'include' // Ensure cookies are sent with the request
        });

        if (response.ok) {
            const message = await response.text();
            console.log(message); // Logout successful
            // Optionally, redirect the user or clear local storage/session storage
            localStorage.removeItem('token');
v        } else {
            console.log('Logout failed');
            // Handle logout failure
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Call the function to log out
export default logout();
