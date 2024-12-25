const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  // Check if the Authorization header exists
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const token = authHeader.replace('Bearer ', '');

    // Verify the token using JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the decoded token has the admin role
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You do not have the required permissions (you are not an admin).' });
    }

    // Attach user data to the request and move to the next middleware
    req.user = decoded;
    next();
  } catch (err) {
    // Handle invalid token case
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateAdmin;
