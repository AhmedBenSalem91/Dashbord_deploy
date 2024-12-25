// Get token and role from localStorage and check if user is an authenticated admin
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Make sure 'role' is set on login
  
    // Check if token exists and role is 'admin'
    if (token && role === 'admin') {
      return true;
    }
  
    return false; // Return false if token or role is missing, or if role is not 'admin'
  };
  