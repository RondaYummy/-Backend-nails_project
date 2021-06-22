const jwt = require('jsonwebtoken');
const { secret } = require('../../config/development.json').jwt;

module.exports = (req, res) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    res.status(401).json({ message: 'Token not provided!!!' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, secret);
    if (payload.type !== 'access') {
      res.status(401).json({ message: 'Invalid token!' });
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Token experied!' });
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'invalid token!' });
    }
  }
};
