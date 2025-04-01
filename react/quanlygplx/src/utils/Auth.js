import { useEffect } from 'react';

const useAuthRedirect = () => {
  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if no token
      window.location.href = "http://192.168.205.130:3000";  // Login page URL
    } else {
      // Redirect to the main page if token exists
      window.location.href = "http://192.168.205.130:5000";  // Main page URL
    }
  }, []);
};

export default useAuthRedirect;
