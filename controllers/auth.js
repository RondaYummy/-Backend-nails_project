const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const authhelper = require('../src/utils/authHelper');
const {
  secret,
} = require('../config/development.json').jwt;
const UserToken = require('../src/models/UserToken');
const User = require('../src/models/User');

const updateTokens = (userId) => {
  const accessToken = authhelper.generateAccesToken(userId);
  const refreshToken = authhelper.generateRefreshToken();

  return authhelper.replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token,
    }));
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();

  if (!user) {
    res.status(401).json({ message: 'User does not exist!' });
    return;
  }

  const isValid = await bcrypt.compareSync(password, user.password);
  // Якщо все добре і пароль підійшов видаю токен
  if (isValid) {
    const updatedToken = await updateTokens(user._id);
    if (updatedToken) {
      res.json(updatedToken);
    }
  }
};

const refreshTokens = async (req, res) => {
  const {
    refreshToken,
  } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);

    if (payload.type !== 'refresh') {
      res.status(400).json({ message: 'Invalid token!' });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Token experied!' });
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'invalid token!' });
    }

    const token = await UserToken.findOne({ user: payload.id }).exec();
    if (token === null) {
      throw new Error('Invalid token!');
    }
    try {
      // token.userId ?
      const updatedTokens = await updateTokens(token.userId);
      res.json(updatedTokens);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = {
  signIn,
  refreshTokens,
};
