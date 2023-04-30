const jwt = require('jsonwebtoken');
const jwtsalt = 'privatekey'; // Make sure to use the same secret key as in your authController

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, jwtsalt);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Invalid token' });
  }
};